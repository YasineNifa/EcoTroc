from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver

from api.models import Profile


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    """
    This signal is triggered after a User object is saved.
    If the user was just created, it creates a corresponding Profile object.
    """
    if created:
        Profile.objects.create(user=instance)
