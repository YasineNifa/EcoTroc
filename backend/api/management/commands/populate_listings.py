import random
from django.core.management.base import BaseCommand
from api.models import Listing, Profile, Category

class Command(BaseCommand):
    help = 'Populates the database with sample Listing instances.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting to populate the database with listings...")

        # --- Get prerequisite objects ---
        profiles = list(Profile.objects.all())
        categories = list(Category.objects.all())

        if not profiles:
            self.stdout.write(self.style.ERROR("No profiles found. Please create some users and profiles first."))
            return
        
        if not categories:
            self.stdout.write(self.style.ERROR("No categories found. Please create categories first."))
            return

        # --- Sample Data ---
        listings_data = [
            {'title': 'Vintage Leather Jacket', 'description': 'Classic brown leather jacket, size medium, excellent condition.', 'token_value': 150, 'brand': 'Schott', 'size': 'M', 'condition': 'very_good'},
            {'title': 'Acoustic Guitar', 'description': 'Yamaha acoustic guitar, great for beginners. Comes with a soft case.', 'token_value': 80, 'brand': 'Yamaha', 'size': 'N/A', 'condition': 'good'},
            {'title': 'Handmade Ceramic Mug', 'description': 'Unique, handcrafted ceramic mug with a beautiful blue glaze.', 'token_value': 30, 'brand': 'Handmade', 'size': 'N/A', 'condition': 'new_without_tag'},
            {'title': 'Mountain Bike', 'description': 'Trek mountain bike, 21 speeds, needs a minor tune-up.', 'token_value': 200, 'brand': 'Trek', 'size': 'L', 'condition': 'satisfactory'},
            {'title': 'Sony WH-1000XM4 Headphones', 'description': 'Noise-cancelling headphones in perfect working condition. Includes original case.', 'token_value': 180, 'brand': 'Sony', 'size': 'N/A', 'condition': 'very_good'},
            {'title': 'Designer Sunglasses', 'description': 'Ray-Ban Wayfarer sunglasses, barely worn.', 'token_value': 75, 'brand': 'Ray-Ban', 'size': 'N/A', 'condition': 'new_without_tag'},
            {'title': 'Set of Classic Novels', 'description': 'A collection of 5 classic literature paperbacks.', 'token_value': 25, 'brand': 'Penguin', 'size': 'N/A', 'condition': 'good'},
            {'title': 'Yoga Mat', 'description': 'Lightly used yoga mat, cleaned and sanitized.', 'token_value': 15, 'brand': 'Lululemon', 'size': 'N/A', 'condition': 'very_good'},
            {'title': 'Nintendo Switch Game - Zelda', 'description': 'The Legend of Zelda: Breath of the Wild for Nintendo Switch.', 'token_value': 40, 'brand': 'Nintendo', 'size': 'N/A', 'condition': 'very_good'},
            {'title': 'Modern Floor Lamp', 'description': 'Sleek black floor lamp with an adjustable head. Perfect for a reading corner.', 'token_value': 60, 'brand': 'IKEA', 'size': 'N/A', 'condition': 'good'},
        ]

        created_count = 0
        for data in listings_data:
            # Use get_or_create to avoid duplicates if the command is run again
            _, created = Listing.objects.get_or_create(
                title=data['title'],
                defaults={
                    'description': data['description'],
                    'token_value': data['token_value'],
                    'owner': random.choice(profiles),
                    'category': random.choice(categories),
                    'brand': data['brand'],
                    'size': data['size'],
                    'condition': data['condition'],
                    # You can add a placeholder image path if needed
                    # 'image': 'path/to/default.jpg'
                }
            )
            if created:
                created_count += 1
        
        self.stdout.write(self.style.SUCCESS(f"Successfully created {created_count} new listings."))