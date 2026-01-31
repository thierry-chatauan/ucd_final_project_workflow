from django.utils import timezone
from django.contrib.auth.models import User

from django.shortcuts import render

from rest_framework import status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Jobs, UserProfile
from .permissions import JobPermission
from .serializers import (
    JobsSerializer,
    UserSignupSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
)


class JobsViewSet(ModelViewSet):
    serializer_class = JobsSerializer
    permission_classes = [IsAuthenticated, JobPermission]

    

    def get_queryset(self):
        qs = Jobs.objects.select_related("operator", "operator__profile").order_by("-created_at")

        # admin sees all
        if self.request.user.is_superuser:
            return qs

        # operator sees only their own
        return qs.filter(operator=self.request.user)

    def perform_create(self, serializer):
        serializer.save(operator=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save()

        # se voltar para in_progress, limpa finished_at
        if getattr(instance, "status", None) == "in_progress" and instance.finished_at is not None:
            instance.finished_at = None
            instance.save(update_fields=["finished_at"])

    @action(detail=True, methods=["post"])
    def finish(self, request, pk=None):
        job = self.get_object()

        # só o operador dono ou admin pode finalizar
        if not request.user.is_superuser and job.operator_id != request.user.id:
            return Response(
                {"detail": "You can only finish your own jobs."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if getattr(job, "status", None) == "finished":
            return Response(
                {"detail": "Job is already finished."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        job.finished_at = timezone.now()
        job.status = "finished"
        job.save(update_fields=["finished_at", "status"])

        serializer = self.get_serializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(
        {
            "id": request.user.id,
            "username": request.user.username,
            "is_superuser": request.user.is_superuser,
        }
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    serializer = UserSignupSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    return Response(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_superuser": user.is_superuser,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def profile(request):
    # garante que o profile existe
    if not hasattr(request.user, "profile"):
        UserProfile.objects.create(user=request.user)

    prof = request.user.profile

    if request.method == "GET":
        return Response(UserProfileSerializer(prof).data)

    serializer = UserProfileSerializer(prof, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

def frontend(request):
    return render(request, "index.html")
