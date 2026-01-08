from rest_framework.permissions import BasePermission

class JobPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # superuser can do everything
        if request.user.is_superuser:
            return True

        # normal users: allow read + create + custom actions (start/finish)
        if view.action in ["list", "retrieve", "create", "start", "finish"]:
            return True

        # block update/partial_update/destroy
        return False

