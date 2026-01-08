from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobsViewSet, me, signup

router = DefaultRouter()
router.register(r'jobs', JobsViewSet, basename='jobs')

urlpatterns = [
    path("signup/", signup, name="signup"),
    path('', include(router.urls)),
    path('me/', me, name='me'),
]
