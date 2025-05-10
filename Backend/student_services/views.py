from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.utils import timezone
from datetime import time
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from django.core.mail import send_mail
from .models import User, RFIDTag, Student, Instructor, Classes, ClassEnrollment, Attendance, AccessControl, Dormitory, DormitoryAssignment, CafeteriaTransaction, StudentProfile, InstructorProfile
from .serializers import UserSerializer, RFIDTagSerializer, StudentSerializer, InstructorSerializer, ClassesSerializer, ClassEnrollmentSerializer, AttendanceSerializer, AccessControlSerializer, DormitorySerializer, DormitoryAssignmentSerializer, CafeteriaTransactionSerializer, CustomTokenObtainPairSerializer, StudentProfileSerializer,InstructorProfileSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Return basic user data
        user_data = UserSerializer(user).data

        # Append profile data based on role
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
                # Get the classes the instructor teaches
                instructor_classes = Classes.objects.filter(instructor=profile.instructor)
                
                # Serialize classes
                classes_data = ClassesSerializer(instructor_classes, many=True).data

                # Include the attendance for each class
                for class_data in classes_data:
                    # Filter attendance based on class and instructor's students
                    class_instance = Classes.objects.get(class_id=class_data['class_id'])
                    attendance_data = Attendance.objects.filter(class_instance=class_instance)
                    attendance_serialized = AttendanceSerializer(attendance_data, many=True).data
                    class_data['attendance'] = attendance_serialized

                # Add the classes and attendances to the profile
                instructor_data['classes'] = classes_data
                user_data['profile'] = instructor_data

            except InstructorProfile.DoesNotExist:
                return Response({"error": "Instructor profile not found"}, status=status.HTTP_404_NOT_FOUND)

        else:
            user_data['profile'] = None  # For proctor or future roles

        return Response(user_data)
    
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
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['student__student_id']

    def create(self, request, *args, **kwargs):
        rfid_tag_id = request.data.get('rfid_tag_id')
        class_id = request.data.get('class_id')

        if not rfid_tag_id or not class_id:
            return Response({"error": "rfid_tag_id and class_id are required"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            # Find the student based on the RFID tag
            student = Student.objects.get(rfid_tag__rfid_tag_id=rfid_tag_id)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"},
                            status=status.HTTP_404_NOT_FOUND)

        try:
            # Find the class instance
            class_instance = Classes.objects.get(class_id=class_id)
        except Classes.DoesNotExist:
            return Response({"error": "Class not found"},
                            status=status.HTTP_404_NOT_FOUND)

        # Check if student is enrolled in the class
        enrolled = ClassEnrollment.objects.filter(
            student=student, class_instance=class_instance).exists()
        if not enrolled:
            return Response({"error": "Student not enrolled in this class"},
                            status=status.HTTP_400_BAD_REQUEST)

        # Create the attendance entry
        attendance = Attendance.objects.create(
            student=student,
            class_instance=class_instance,
            time_in=timezone.now(),
            date=timezone.now().date(),
            status="present"
        )

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
        location = request.data.get('location')

        now = timezone.now()
        # Find the student by RFID
        try:
            student = Student.objects.get(rfid_tag__rfid_tag_id=rfid_tag_id)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        # Create access log
        log = AccessControl.objects.create(
            rfid_tag_id=rfid_tag_id,
            location=location,
            access_time=now,
            status='granted'
        )

        serializer = AccessControlSerializer(log)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DormitoryViewSet(viewsets.ModelViewSet):
    queryset = Dormitory.objects.all()
    serializer_class = DormitorySerializer

class DormitoryAssignmentViewSet(viewsets.ModelViewSet):
    queryset = DormitoryAssignment.objects.all()
    serializer_class = DormitoryAssignmentSerializer

class CafeteriaTransactionViewSet(viewsets.ModelViewSet):
    queryset = CafeteriaTransaction.objects.all()
    serializer_class = CafeteriaTransactionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['rfid_tag__rfid_tag_id']

    def create(self, request, *args, **kwargs):
        rfid_tag_id = request.data.get('rfid_tag_id')

        if not rfid_tag_id:
            return Response({"error": "RFID tag ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            rfid_tag = RFIDTag.objects.get(rfid_tag_id=rfid_tag_id, status='active')
        except RFIDTag.DoesNotExist:
            return Response({"error": "Invalid or inactive RFID tag."}, status=status.HTTP_404_NOT_FOUND)

        try:
            student = Student.objects.get(rfid_tag__rfid_tag_id=rfid_tag_id)
        except Student.DoesNotExist:
            return Response({"error": "No student associated with this RFID tag."}, status=status.HTTP_403_FORBIDDEN)

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

        # Create the transaction
        transaction = CafeteriaTransaction.objects.create(
            rfid_tag=rfid_tag,
            service_type=service_type,
            transaction_time=now,
            date=now.date()
        )

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
        recipient_list=["yosephsagawa123@gmail.com"],  # or dynamically fetched
    )

    return Response({"message": "Report sent"})
