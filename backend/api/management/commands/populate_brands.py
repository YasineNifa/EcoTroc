from django.core.management.base import BaseCommand
from django.utils.text import slugify

from api.models import Brand


class Command(BaseCommand):
    help = "Populates the database with sample Brand instances."

    BRANDS_TO_ADD = {
        "Fashion (Women & Men)": [
            "Nike", "Adidas", "Zara", "H&M", "Levi's", "Gucci", "Louis Vuitton",
            "Chanel", "Uniqlo", "ASOS", "Ralph Lauren", "Tommy Hilfiger",
            "Calvin Klein", "Puma", "The North Face", "Patagonia", "Dr. Martens"
        ],
        "Kids": [
            "LEGO", "Disney", "Mattel", "Hasbro", "Carter's", "Chicco", "Fisher-Price"
        ],
        "Home": [
            "IKEA", "Dyson", "Nespresso", "Tefal", "Philips", "Zara Home",
            "Maisons du Monde"
        ],
        "Electronics": [
            "Apple", "Samsung", "Sony", "LG", "Dell", "HP", "Bose", "Canon", "Nikon"
        ],
        "Entertainment & Hobbies": [
            "Nintendo", "PlayStation", "Xbox", "Netflix", "Fender", "Gibson",
            "Games Workshop"
        ],
        "Sports": [
            "Decathlon", "Under Armour", "Reebok", "Salomon", "Rossignol"
        ]
    }


    def handle(self, *args, **kwargs):
        self.stdout.write("Starting to populate the database with brands...")
        created_count = 0
        skipped_count = 0
        all_brands = [brand for sublist in self.BRANDS_TO_ADD.values() for brand in sublist]
        
        for brand_name in all_brands:
            brand_slug = slugify(brand_name)
            _, created = Brand.objects.get_or_create(slug=brand_slug, defaults={'name': brand_name})
            
            if created:
                created_count += 1
                self.stdout.write(f"  + Added brand: {brand_name}")
            else:
                skipped_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"\nPopulation complete. Added {created_count} new brands. Skipped {skipped_count} existing brands."
        ))

