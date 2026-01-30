from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User

class Jobs(models.Model):
    STATUS_CHOICES = [
        ("in_progress", "In progress"),
        ("finished", "Finished"),
    ]

    operator = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="jobs",
    )

    machine = models.CharField(max_length=200)
    customer = models.CharField(max_length=200)
    drawing_number = models.CharField(max_length=200)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="in_progress")

    created_at = models.DateTimeField(default=timezone.now)
    finished_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.operator} - {self.machine}"


class UserProfile(models.Model):
    AVATAR_CHOICES = [
        ("avatar1", "Avatar 1"),
        ("avatar2", "Avatar 2"),
        ("avatar3", "Avatar 3"),
        ("avatar4", "Avatar 4"),
        ("avatar5", "Avatar 5"),
        ("avatar6", "Avatar 6"),
        ("avatar7", "Avatar 7"),
        ("avatar8", "Avatar 8"),
        ("avatar9", "Avatar 9"),
        ("avatar10", "Avatar 10"),
        ("avatar11", "Avatar 11"),
        ("avatar12", "Avatar 12"),
        ("avatar13", "Avatar 13"),
        ("avatar14", "Avatar 14"),
        ("avatar15", "Avatar 15"),
        ("avatar16", "Avatar 16"),
        ("avatar17", "Avatar 17"),
        ("avatar18", "Avatar 18"),
        ("avatar19", "Avatar 19"),
        ("avatar20", "Avatar 20"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = models.CharField(max_length=20, choices=AVATAR_CHOICES, default="avatar1")

    def __str__(self):
        return f"Profile({self.user.username})"
