from django.contrib import admin
from .models import Jobs

# Register your models here.
class JobsAdmin(admin.ModelAdmin):
    list_display = ('operator', 'machine', 'customer', 'drawing_number', 'created_at', 'finished_at', 'status')
    search_fields = ('operator', 'machine', 'customer', 'drawing_number')
    ordering = ('-created_at',)

admin.site.register(Jobs, JobsAdmin)
