from django.core.management.base import BaseCommand
from django.utils.text import slugify

from api.models import Category


class Command(BaseCommand):
    help = "Populates the database with sample Category instances."

    CATEGORIES_TO_ADD = [
        "Men",
        "Women",
        "Kids",
        "Home",
        "Electronics",
        "Sports",
        "Books",
        "Collectibles",
        "Art",
        "Jewelry",
        "Health & Beauty",
        "Automotive",
        "Pet Supplies",
        "Musical Instruments",
        "Craft Supplies",
    ]

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting to populate the database with categories...")
        created_count = 0
        skipped_count = 0

        for category_name in self.CATEGORIES_TO_ADD:
            category_slug = slugify(category_name)
            _, created = Category.objects.get_or_create(
                slug=category_slug, defaults={"name": category_name}
            )

            if created:
                created_count += 1
                self.stdout.write(f"  + Added category: {category_name}")
            else:
                skipped_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"\nPopulation complete. Added {created_count} new categories. Skipped {skipped_count} existing categories."
            )
        )
