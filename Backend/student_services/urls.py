from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RFIDTagViewSet, StudentViewSet, InstructorViewSet, ClassesViewSet, ClassEnrollmentViewSet, AttendanceViewSet, AccessControlViewSet, DormitoryViewSet, DormitoryAssignmentViewSet, CafeteriaTransactionViewSet, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


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
     path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
