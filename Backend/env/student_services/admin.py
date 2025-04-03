from django.contrib import admin


from .models import RFIDTag,Student,Instructor,Classes,ClassEnrollment,Attendance,AccessControl,Dormitory,DormitoryAssignment,CafeteriaTransaction
# Register your models here.
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