from django.db import models

# Create your models here.
class Message(models.Model):
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100, default='N/A')
    content = models.TextField()

    def __str__(self):
        return f"{self.name} {self.surname}: {self.content[:20]}..."