from .models import Jobs
from rest_framework import serializers
from django.contrib.auth.models import User

class JobsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        fields = '__all__'
        
class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        # IMPORTANT: this hashes the password correctly
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user