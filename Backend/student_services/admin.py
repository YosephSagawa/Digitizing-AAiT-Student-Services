from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import RFIDTag,Student,Instructor,Classes,ClassEnrollment,Attendance,AccessControl,Dormitory,DormitoryAssignment,CafeteriaTransaction,User,StudentProfile,InstructorProfile,OTP

class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role Info', {'fields': ('role',)}),
    )

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(RFIDTag)
admin.site.register(Student)
admin.site.register(Instructor)
admin.site.register(Classes)
admin.site.register(ClassEnrollment)
admin.site.register(Attendance)
admin.site.register(AccessControl)
admin.site.register(Dormitory)
admin.site.register(DormitoryAssignment)
admin.site.register(CafeteriaTransaction)
admin.site.register(StudentProfile)
admin.site.register(InstructorProfile)
admin.site.register(OTP)
