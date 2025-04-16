from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

# Enum-like choices for status fields
RFID_STATUS_CHOICES = [
    ('active', 'Active'),
    ('inactive', 'Inactive'),
]

ATTENDANCE_STATUS_CHOICES = [
    ('present', 'Present'),
    ('absent', 'Absent'),
    ('late', 'Late'),
]

ACCESS_STATUS_CHOICES = [
    ('granted', 'Granted'),
    ('denied', 'Denied'),
]

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('instructor', 'Instructor'),
        ('proctor', 'Proctor'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.username} ({self.role})"

class RFIDTag(models.Model):
    rfid_tag_id = models.CharField(max_length=50, primary_key=True)
    issue_date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=10, choices=RFID_STATUS_CHOICES, default='active')

    def __str__(self):
        return self.rfid_tag_id

class Student(models.Model):
    student_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=100, unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    rfid_tag = models.OneToOneField(RFIDTag, on_delete=models.CASCADE)
    image = models.ImageField(upload_to ="student_images/", blank=True, null=True)
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.student_id})"

class Instructor(models.Model):
    instructor_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=100, unique=True)
    rfid_tag = models.OneToOneField(RFIDTag, on_delete=models.CASCADE, blank=True, null=True)
    image = models.ImageField(upload_to="instructor_images/", blank = True, null = True)
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.instructor_id})"

class Classes(models.Model):
    class_id = models.AutoField(primary_key=True)
    class_name = models.CharField(max_length=50)
    instructor = models.ForeignKey(Instructor, on_delete=models.SET_NULL, null=True)
    schedule = models.CharField(max_length=100)

    def __str__(self):
        return self.class_name

class ClassEnrollment(models.Model):
    enrollment_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    class_instance = models.ForeignKey(Classes, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.student} in {self.class_instance}"

    class Meta:
        unique_together = ('student', 'class_instance')  # Prevent duplicate enrollments

class Attendance(models.Model):
    attendance_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    class_instance = models.ForeignKey(Classes, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    time_in = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=10, choices=ATTENDANCE_STATUS_CHOICES, default='present')

    def __str__(self):
        return f"{self.student} - {self.class_instance} on {self.date}"

class AccessControl(models.Model):
    access_id = models.AutoField(primary_key=True)
    rfid_tag = models.ForeignKey(RFIDTag, on_delete=models.CASCADE)
    location = models.CharField(max_length=50)
    access_time = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=10, choices=ACCESS_STATUS_CHOICES, default='granted')

    def __str__(self):
        return f"{self.rfid_tag} at {self.location} - {self.access_time}"

class Dormitory(models.Model):
    dormitory_id = models.AutoField(primary_key=True)
    dormitory_name = models.CharField(max_length=50)
    room_number = models.CharField(max_length=10)
    capacity = models.IntegerField()

    def __str__(self):
        return f"{self.dormitory_name} - Room {self.room_number}"

class DormitoryAssignment(models.Model):
    assignment_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    dormitory = models.ForeignKey(Dormitory, on_delete=models.CASCADE)
    assignment_date = models.DateField(default=timezone.now)

    def __str__(self):
        return f"{self.student} in {self.dormitory}"

    class Meta:
        unique_together = ('student', 'dormitory')  # Optional: Prevent duplicate assignments

class CafeteriaTransaction(models.Model):
    transaction_id = models.AutoField(primary_key=True)
    rfid_tag = models.ForeignKey(RFIDTag, on_delete=models.CASCADE)
    service_type = models.CharField(max_length=50)
    transaction_time = models.DateTimeField(default=timezone.now)
    date = models.DateField(default=timezone.now)

    def __str__(self):
        return f"{self.rfid_tag} - {self.service_type} at {self.transaction_time}"


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    student = models.OneToOneField(Student, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} -> {self.student}"


class InstructorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='instructor_profile')
    instructor = models.OneToOneField(Instructor, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} -> {self.instructor}"
