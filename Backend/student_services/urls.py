from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RFIDTagViewSet, StudentViewSet, InstructorViewSet, ClassesViewSet, ClassEnrollmentViewSet, AttendanceViewSet, AccessControlViewSet, DormitoryViewSet, DormitoryAssignmentViewSet, CafeteriaTransactionViewSet

# Create a router and register the viewsets with it
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'rfid-tags', RFIDTagViewSet)
router.register(r'students', StudentViewSet)
router.register(r'instructors', InstructorViewSet)
router.register(r'classes', ClassesViewSet)
router.register(r'class-enrollments', ClassEnrollmentViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'access-control', AccessControlViewSet)
router.register(r'dormitories', DormitoryViewSet)
router.register(r'dormitory-assignments', DormitoryAssignmentViewSet)
router.register(r'cafeteria-transactions', CafeteriaTransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Include the router's URLs
]
