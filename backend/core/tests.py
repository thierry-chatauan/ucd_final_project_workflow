from django.test import TestCase
from django.contrib.auth.models import User
from .models import Jobs, UserProfile

class JobsModelTest(TestCase):

    def setUp(self):
        # Create a user for testing
        self.user = User.objects.create_user(username="operador1", password="password123")

    def test_job_creation_default_status(self):
        """Test if a job is created with default status 'in_progress'"""
        job = Jobs.objects.create(
            operator=self.user,
            machine="Machine Name",
            customer="Cliente Name",
            drawing_number="DES-001"
        )
        self.assertEqual(job.status, "in_progress")
        self.assertIsNone(job.finished_at) # finished_at should be None on creation

    def test_job_str_representation(self):
        """Test the __str__ method of the Jobs model"""
        job = Jobs.objects.create(
            operator=self.user,
            machine="Machine number",
            customer="Cliente B",
            drawing_number="DES-002"
        )
        expected_name = f"operador1 - Machine number"
        self.assertEqual(str(job), expected_name)

class UserProfileModelTest(TestCase):

    def test_profile_cascade_deletion(self):
        """Test if the profile is deleted when the user is deleted"""
        user = User.objects.create_user(username="joao", password="123")
        self.assertTrue(UserProfile.objects.filter(user=user).exists())
        
        user.delete()
        
        #
        self.assertEqual(UserProfile.objects.count(), 0)