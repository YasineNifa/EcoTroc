import os

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from api.models import Profile


class Command(BaseCommand):
    help = "Creates (or updates) a demo user with a starting token balance."

    def handle(self, *args, **options):
        username = os.environ.get("DEMO_USERNAME", "demo")
        email = os.environ.get("DEMO_EMAIL", "demo@ecotroc.app")
        password = os.environ.get("DEMO_PASSWORD", "DemoPass123!")
        token_balance = int(os.environ.get("DEMO_TOKEN_BALANCE", "100"))

        user, created = User.objects.get_or_create(
            username=username, defaults={"email": email}
        )
        if not created:
            user.email = email
        user.set_password(password)
        user.is_active = True
        user.save()

        profile, _ = Profile.objects.get_or_create(
            user=user, defaults={"jeton_balance": token_balance}
        )
        profile.jeton_balance = token_balance
        profile.save(update_fields=["jeton_balance"])

        self.stdout.write(
            self.style.SUCCESS(
                f"Demo user '{username}' ready ({'created' if created else 'updated'}) "
                f"with {token_balance} Jetons."
            )
        )
