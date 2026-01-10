from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny

from .permissions import JobPermission
from .models import Jobs
from .serializers import JobsSerializer, UserSignupSerializer


class JobsViewSet(ModelViewSet):
    queryset = Jobs.objects.all()
    serializer_class = JobsSerializer
    permission_classes = [IsAuthenticated, JobPermission]

    def perform_update(self, serializer):
        """
        Optional but recommended:
        If admin sets status back to in_progress, clear finished_at.
        """
        instance = serializer.save()

        if hasattr(instance, "status") and instance.status == "in_progress":
            if instance.finished_at is not None:
                instance.finished_at = None
                instance.save(update_fields=["finished_at"])

    @action(detail=True, methods=["post"])
    def finish(self, request, pk=None):
        job = self.get_object()

        # ✅ use status as the source of truth
        if hasattr(job, "status") and job.status == "finished":
            return Response(
                {"detail": "Job is already finished."},
                status=status.HTTP_400_BAD_REQUEST
            )

        job.finished_at = timezone.now()

        if hasattr(job, "status"):
            job.status = "finished"

        job.save()

        serializer = self.get_serializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "is_superuser": request.user.is_superuser,
    })


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
        status=status.HTTP_201_CREATED
    )
