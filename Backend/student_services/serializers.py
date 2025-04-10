from rest_framework import serializers
from .models import User, RFIDTag, Student, Instructor, Classes, ClassEnrollment, Attendance, AccessControl, Dormitory, DormitoryAssignment, CafeteriaTransaction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class RFIDTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = RFIDTag
        fields = ['rfid_tag_id', 'issue_date', 'status']

class StudentSerializer(serializers.ModelSerializer):
    rfid_tag = RFIDTagSerializer()  # Nested RFIDTagSerializer

    class Meta:
        model = Student
        fields = ['student_id', 'first_name', 'last_name', 'email', 'phone', 'rfid_tag', 'image']

class InstructorSerializer(serializers.ModelSerializer):
    rfid_tag = RFIDTagSerializer()  # Nested RFIDTagSerializer

    class Meta:
        model = Instructor
        fields = ['instructor_id', 'first_name', 'last_name', 'email', 'rfid_tag', 'image']

class ClassesSerializer(serializers.ModelSerializer):
    instructor = InstructorSerializer()  # Nested InstructorSerializer

    class Meta:
        model = Classes
        fields = ['class_id', 'class_name', 'instructor', 'schedule']

class ClassEnrollmentSerializer(serializers.ModelSerializer):
    student = StudentSerializer()  # Nested StudentSerializer
    class_instance = ClassesSerializer()  # Nested ClassesSerializer

    class Meta:
        model = ClassEnrollment
        fields = ['enrollment_id', 'student', 'class_instance']

class AttendanceSerializer(serializers.ModelSerializer):
    student = StudentSerializer()  # Nested StudentSerializer
    class_instance = ClassesSerializer()  # Nested ClassesSerializer

    class Meta:
        model = Attendance
        fields = ['attendance_id', 'student', 'class_instance', 'date', 'time_in', 'status']

class AccessControlSerializer(serializers.ModelSerializer):
    rfid_tag = RFIDTagSerializer()  # Nested RFIDTagSerializer

    class Meta:
        model = AccessControl
        fields = ['access_id', 'rfid_tag', 'location', 'access_time', 'status']

class DormitorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Dormitory
        fields = ['dormitory_id', 'dormitory_name', 'room_number', 'capacity']

class DormitoryAssignmentSerializer(serializers.ModelSerializer):
    student = StudentSerializer()  # Nested StudentSerializer
    dormitory = DormitorySerializer()  # Nested DormitorySerializer

    class Meta:
        model = DormitoryAssignment
        fields = ['assignment_id', 'student', 'dormitory', 'assignment_date']

class CafeteriaTransactionSerializer(serializers.ModelSerializer):
    rfid_tag = RFIDTagSerializer()  # Nested RFIDTagSerializer

    class Meta:
        model = CafeteriaTransaction
        fields = ['transaction_id', 'rfid_tag', 'service_type', 'transaction_time', 'date']
