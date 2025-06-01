from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes, action
from django.utils import timezone
from datetime import time, timedelta, datetime
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import send_mail
import random
import string
from .models import User, RFIDTag, Student, Instructor, Classes, ClassEnrollment, Attendance, AccessControl, Dormitory, DormitoryAssignment, CafeteriaTransaction, StudentProfile, InstructorProfile, OTP
from .serializers import UserSerializer, RFIDTagSerializer, StudentSerializer, InstructorSerializer, ClassesSerializer, ClassEnrollmentSerializer, AttendanceSerializer, AccessControlSerializer, DormitorySerializer, DormitoryAssignmentSerializer, CafeteriaTransactionSerializer, CustomTokenObtainPairSerializer, StudentProfileSerializer, InstructorProfileSerializer, OTPSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = UserSerializer(user).data

        if user.role == 'student':
            try:
                profile = StudentProfile.objects.get(user=user)
                user_data['profile'] = StudentProfileSerializer(profile).data
            except StudentProfile.DoesNotExist:
                return Response({"error": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)

        elif user.role == 'instructor':
            try:
                profile = InstructorProfile.objects.get(user=user)
                instructor_data = InstructorProfileSerializer(profile).data
                instructor_classes = Classes.objects.filter(instructor=profile.instructor)
                classes_data = ClassesSerializer(instructor_classes, many=True).data

                for class_data in classes_data:
                    class_instance = Classes.objects.get(class_id=class_data['class_id'])
                    attendance_data = Attendance.objects.filter(class_instance=class_instance)
                    attendance_serialized = AttendanceSerializer(attendance_data, many=True).data
                    class_data['attendance'] = attendance_serialized

                instructor_data['classes'] = classes_data
                user_data['profile'] = instructor_data
            except InstructorProfile.DoesNotExist:
                return Response({"error": "Instructor profile not found"}, status=status.HTTP_404_NOT_FOUND)

        else:
            user_data['profile'] = None

        return Response(user_data)

class GenerateOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != 'student':
            return Response({"error": "Only students can request an OTP"}, status=status.HTTP_403_FORBIDDEN)

        try:
            profile = StudentProfile.objects.get(user=user)
            student = profile.student
        except StudentProfile.DoesNotExist:
            return Response({"error": "Student profile not found"}, status=status.HTTP_404_NOT_FOUND)

        # Generate 6-digit OTP
        otp_code = ''.join(random.choices(string.digits, k=6))
        expires_at = timezone.now() + timedelta(minutes=30)  # OTP valid for 30 minutes

        # Create OTP record
        otp = OTP.objects.create(
            code=otp_code,
            student=student,
            expires_at=expires_at
        )

        # Send OTP via email
        send_mail(
            subject="Your One-Time Password (OTP) for Access",
            message=f"Dear {student.first_name},\n\nYour OTP is {otp_code}. It is valid until {expires_at}.\n\nUse this OTP for gate access, dormitory access, cafeteria transactions, and attendance.\n\nBest regards,\nStudent Services Team",
            from_email="yosephsagawa0@gmail.com",
            recipient_list=[student.email],
            fail_silently=False,
        )

        return Response({"message": "OTP sent to your email", "otp_id": otp.otp_id}, status=status.HTTP_201_CREATED)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class RFIDTagViewSet(viewsets.ModelViewSet):
    queryset = RFIDTag.objects.all()
    serializer_class = RFIDTagSerializer
    lookup_field = 'rfid_tag_id'

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['rfid_tag__rfid_tag_id']

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['rfid_tag__rfid_tag_id']

class ClassesViewSet(viewsets.ModelViewSet):
    queryset = Classes.objects.all()
    serializer_class = ClassesSerializer

class ClassEnrollmentViewSet(viewsets.ModelViewSet):
    queryset = ClassEnrollment.objects.all()
    serializer_class = ClassEnrollmentSerializer

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['student__student_id']

    def create(self, request, *args, **kwargs):
        rfid_tag_id = request.data.get('rfid_tag_id')
        otp = request.data.get('otp')
        class_id = request.data.get('class_id')

        if not (rfid_tag_id or otp) or not class_id:
            return Response({"error": "Either rfid_tag_id or otp and class_id are required"},
                            status=status.HTTP_400_BAD_REQUEST)

        student = None
        if rfid_tag_id:
            try:
                student = Student.objects.get(rfid_tag__rfid_tag_id=rfid_tag_id)
            except Student.DoesNotExist:
                return Response({"error": "Student not found"},
                                status=status.HTTP_404_NOT_FOUND)
        elif otp:
            try:
                otp_record = OTP.objects.get(code=otp, status='valid')
                if otp_record.expires_at < timezone.now():
                    otp_record.status = 'expired'
                    otp_record.save()
                    return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)
                student = otp_record.student
            except OTP.DoesNotExist:
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            class_instance = Classes.objects.get(class_id=class_id)
        except Classes.DoesNotExist:
            return Response({"error": "Class not found"},
                            status=status.HTTP_404_NOT_FOUND)

        enrolled = ClassEnrollment.objects.filter(
            student=student, class_instance=class_instance).exists()
        if not enrolled:
            return Response({"error": "Student not enrolled in this class"},
                            status=status.HTTP_400_BAD_REQUEST)

        today = timezone.now().date()
        already_marked = Attendance.objects.filter(
            student=student,
            class_instance=class_instance,
            date=today
        ).exists()
        if already_marked:
            return Response({"error": "Attendance already recorded."}, status=status.HTTP_200_OK)

        # Determine lateness based on schedule
        now = timezone.now()
        schedule = class_instance.schedule  # e.g., "U1"
        try:
            day_letter = schedule[0]  # "U"
            block = int(schedule[1:])  # 1
            weekday_map = {"M": 0, "T": 1, "W": 2, "H": 3, "F": 4, "S": 5, "U": 6}
            block_start_hours = {1: 8, 2: 10, 3: 12, 4: 14, 5: 16}  # Block start times
            if day_letter not in weekday_map or block not in block_start_hours:
                return Response({"error": "Invalid class schedule format"},
                                status=status.HTTP_400_BAD_REQUEST)
            start_hour = block_start_hours[block]
            class_start_time = timezone.make_aware(
                datetime.combine(today, time(start_hour, 0))
            )
            lateness_threshold = class_start_time + timedelta(minutes=5)
            status_value = "late" if now > lateness_threshold else "present"
        except (ValueError, KeyError) as e:
            return Response({"error": "Invalid class schedule format"},
                            status=status.HTTP_400_BAD_REQUEST)

        attendance = Attendance.objects.create(
            student=student,
            class_instance=class_instance,
            time_in=now,
            date=today,
            status=status_value
        )

        if otp:
            otp_record.status = 'used'
            otp_record.save()

        serializer = AttendanceSerializer(attendance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AccessControlViewSet(viewsets.ModelViewSet):
    queryset = AccessControl.objects.all()
    serializer_class = AccessControlSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['rfid_tag__rfid_tag_id', 'location']
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        rfid_tag_id = request.data.get('rfid_tag_id')
        otp = request.data.get('otp')
        location = request.data.get('location')

        if not (rfid_tag_id or otp):
            return Response({"error": "Either rfid_tag_id or otp is required"},
                            status=status.HTTP_400_BAD_REQUEST)

        now = timezone.now()
        student = None
        if rfid_tag_id:
            try:
                student = Student.objects.get(rfid_tag__rfid_tag_id=rfid_tag_id)
            except Student.DoesNotExist:
                return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        elif otp:
            try:
                otp_record = OTP.objects.get(code=otp, status='valid')
                if otp_record.expires_at < timezone.now():
                    otp_record.status = 'expired'
                    otp_record.save()
                    return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)
                student = otp_record.student
            except OTP.DoesNotExist:
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        log = AccessControl.objects.create(
            rfid_tag_id=rfid_tag_id,
            otp=otp,
            location=location,
            access_time=now,
            status='granted'
        )

        if otp:
            otp_record.status = 'used'
            otp_record.save()

        serializer = AccessControlSerializer(log)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DormitoryViewSet(viewsets.ModelViewSet):
    queryset = Dormitory.objects.all()
    serializer_class = DormitorySerializer

class DormitoryAssignmentViewSet(viewsets.ModelViewSet):
    queryset = DormitoryAssignment.objects.all()
    serializer_class = DormitoryAssignmentSerializer

    @action(detail=False, methods=['post'], url_path='check-access')
    def check_access(self, request):
        rfid_tag_id = request.data.get('rfid_tag_id')
        otp = request.data.get('otp')
        dormitory_id = request.data.get('dormitory_id')

        if not (rfid_tag_id or otp) or not dormitory_id:
            return Response({'error': 'Missing RFID tag or OTP or dormitory ID'}, status=status.HTTP_400_BAD_REQUEST)

        student = None
        if rfid_tag_id:
            try:
                rfid_tag = RFIDTag.objects.get(rfid_tag_id=rfid_tag_id, status='active')
                student = Student.objects.get(rfid_tag=rfid_tag)
            except (RFIDTag.DoesNotExist, Student.DoesNotExist):
                AccessControl.objects.create(
                    rfid_tag_id=rfid_tag_id,
                    location='dormitory',
                    status='denied',
                    access_time=timezone.now()
                )
                return Response({'access': 'denied', 'reason': 'Invalid or inactive RFID or student not found'}, status=status.HTTP_403_FORBIDDEN)
        elif otp:
            try:
                otp_record = OTP.objects.get(code=otp, status='valid')
                if otp_record.expires_at < timezone.now():
                    otp_record.status = 'expired'
                    otp_record.save()
                    return Response({'access': 'denied', 'reason': 'OTP expired'}, status=status.HTTP_403_FORBIDDEN)
                student = otp_record.student
            except OTP.DoesNotExist:
                AccessControl.objects.create(
                    otp=otp,
                    location='dormitory',
                    status='denied',
                    access_time=timezone.now()
                )
                return Response({'access': 'denied', 'reason': 'Invalid OTP'}, status=status.HTTP_403_FORBIDDEN)

        assigned = DormitoryAssignment.objects.filter(student=student, dormitory_id=dormitory_id).exists()
        access_status = 'granted' if assigned else 'denied'

        AccessControl.objects.create(
            rfid_tag_id=rfid_tag_id,
            otp=otp,
            location='dormitory',
            status=access_status,
            access_time=timezone.now()
        )

        if access_status == 'granted' and otp:
            otp_record.status = 'used'
            otp_record.save()

        return Response({'access': access_status}, status=status.HTTP_200_OK if access_status == 'granted' else status.HTTP_403_FORBIDDEN)

class CafeteriaTransactionViewSet(viewsets.ModelViewSet):
    queryset = CafeteriaTransaction.objects.all()
    serializer_class = CafeteriaTransactionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['rfid_tag__rfid_tag_id']

    def create(self, request, *args, **kwargs):
        rfid_tag_id = request.data.get('rfid_tag_id')
        otp = request.data.get('otp')

        if not (rfid_tag_id or otp):
            return Response({"error": "Either RFID tag ID or OTP is required."}, status=status.HTTP_400_BAD_REQUEST)

        student = None
        if rfid_tag_id:
            try:
                rfid_tag = RFIDTag.objects.get(rfid_tag_id=rfid_tag_id, status='active')
                student = Student.objects.get(rfid_tag__rfid_tag_id=rfid_tag_id)
            except RFIDTag.DoesNotExist:
                return Response({"error": "Invalid or inactive RFID tag."}, status=status.HTTP_404_NOT_FOUND)
            except Student.DoesNotExist:
                return Response({"error": "No student associated with this RFID tag."}, status=status.HTTP_403_FORBIDDEN)
        elif otp:
            try:
                otp_record = OTP.objects.get(code=otp, status='valid')
                if otp_record.expires_at < timezone.now():
                    otp_record.status = 'expired'
                    otp_record.save()
                    return Response({"error": "OTP expired"}, status=status.HTTP_400_BAD_REQUEST)
                student = otp_record.student
            except OTP.DoesNotExist:
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        now = timezone.now()
        current_time = now.time()

        def get_service_type(t):
            if time(6, 0) <= t <= time(9, 30):
                return 'breakfast'
            elif time(11, 0) <= t <= time(14, 0):
                return 'lunch'
            elif time(15, 0) <= t <= time(21, 0):
                return 'dinner'
            return None

        service_type = get_service_type(current_time)
        if not service_type:
            return Response({"error": "Not a valid time for cafeteria service."}, status=status.HTTP_403_FORBIDDEN)

        transaction = CafeteriaTransaction.objects.create(
            rfid_tag_id=rfid_tag_id,
            otp=otp,
            service_type=service_type,
            transaction_time=now,
            date=now.date()
        )

        if otp:
            otp_record.status = 'used'
            otp_record.save()

        return Response({
            "message": f"{service_type.title()} access granted to {student.first_name} {student.last_name}."
        }, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_attendance_report(request):
    class_name = request.data.get("class_name")
    date = request.data.get("date")
    attendance = request.data.get("attendance", [])

    lines = [f"Attendance for {class_name} on {date}:\n"]
    for rec in attendance:
        lines.append(
            f"{rec['student_name']} ({rec['student_id']}): {rec['status']} at {rec['time_in']}"
        )

    message = "\n".join(lines)

    send_mail(
        subject=f"Attendance Report for {class_name} - {date}",
        message=message,
        from_email="yosephsagawa0@gmail.com",
        recipient_list=["yosephsagawa123@gmail.com"],
    )

    return Response({"message": "Report sent"})