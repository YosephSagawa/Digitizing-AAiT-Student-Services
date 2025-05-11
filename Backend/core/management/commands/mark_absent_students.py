import datetime
import re
from django.utils import timezone
from django.core.management.base import BaseCommand
from student_services.models import Classes, Student, Attendance, ClassEnrollment

# Day code to weekday integer (Python: Monday=0 ... Sunday=6)
DAY_MAP = {
    "M": 0,  # Monday
    "T": 1,  # Tuesday
    "W": 2,  # Wednesday
    "R": 3,  # Thursday
    "F": 4,  # Friday
    "S": 5,  # Saturday
    "U": 6,  # Sunday
}

DEFAULT_DURATION_MINUTES = 60  # 1 hour

def parse_schedule(schedule_str):
    match = re.match(r'([A-Z])(\d+)', schedule_str)
    if not match:
        raise ValueError(f"Invalid schedule format: {schedule_str}")
    
    day_code, hour_str = match.groups()
    weekday = DAY_MAP.get(day_code.upper())
    hour = int(hour_str)

    if weekday is None or not (0 <= hour <= 23):
        raise ValueError(f"Invalid day or hour: {schedule_str}")
    
    start_time = datetime.time(hour, 0)
    # Add duration to compute end time
    end_dt = (datetime.datetime.combine(datetime.date.today(), start_time) +
              datetime.timedelta(minutes=DEFAULT_DURATION_MINUTES))
    end_time = end_dt.time()

    return weekday, start_time, end_time

class Command(BaseCommand):
    help = 'Marks students as absent based on the current date and class schedule'

    def handle(self, *args, **kwargs):
        today = timezone.now().date()
        current_weekday = timezone.now().weekday()

        for class_instance in Classes.objects.all():
            try:
                class_weekday, start_time, end_time = parse_schedule(class_instance.schedule)
            except ValueError as e:
                self.stdout.write(self.style.ERROR(f"Skipping class {class_instance.class_name}: {e}"))
                continue

            if class_weekday != current_weekday:
                continue  # Skip if class is not today

            class_end_datetime = datetime.datetime.combine(today, end_time).replace(tzinfo=timezone.get_current_timezone())
            if timezone.now() < class_end_datetime:
                continue  # Class not over yet

            # Fetch students enrolled in the class using ClassEnrollment
            enrolled_students = ClassEnrollment.objects.filter(class_instance=class_instance)
            
            for enrollment in enrolled_students:
                student = enrollment.student  # Get the student associated with this enrollment

                # Check if the student has attended (i.e., there is an attendance record for today)
                attendance_record = Attendance.objects.filter(
                    student=student, 
                    class_instance=class_instance,
                    date=today
                ).first()

                if not attendance_record:
                    # If no attendance record, mark the student as absent
                    self.stdout.write(f"{student.first_name} {student.last_name} is absent for {class_instance.class_name} on {today}")
                    # You can also create an Attendance record here if you want to
                    # Attendance.objects.create(student=student, class_instance=class_instance, date=today, status='absent')
