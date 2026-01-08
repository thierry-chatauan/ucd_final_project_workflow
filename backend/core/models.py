from django.db import models

class Jobs(models.Model):

    STATUS_CHOICES = [
        ("in_progress", "In progress"),
        ("finished", "Finished"),
    ]

    operator = models.CharField(max_length=200)
    machine = models.CharField(max_length=200)
    customer = models.CharField(max_length=200)
    drawing_number = models.CharField(max_length=200)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="in_progress",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.operador} - {self.machine}"
