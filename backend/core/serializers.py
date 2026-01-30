from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Jobs, UserProfile

class OperatorSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    avatar = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        # obj here is the User
        profile = getattr(obj, "profile", None)
        return getattr(profile, "avatar", None)


class JobsSerializer(serializers.ModelSerializer):
    operator = OperatorSerializer(read_only=True)

    class Meta:
        model = Jobs
        fields = "__all__"
        read_only_fields = ["operator"]


class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", required=False)

    class Meta:
        model = UserProfile
        fields = ("username", "email", "avatar")

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})

        if "email" in user_data:
            instance.user.email = user_data["email"]
            instance.user.save(update_fields=["email"])

        return super().update(instance, validated_data)

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=6)

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user
