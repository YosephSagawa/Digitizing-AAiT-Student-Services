from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.views import TokenObtainPairView
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

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['rfid_tag__rfid_tag_id']

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer

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

class AccessControlViewSet(viewsets.ModelViewSet):
    queryset = AccessControl.objects.all()
    serializer_class = AccessControlSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['rfid_tag__rfid_tag_id', 'location']

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
