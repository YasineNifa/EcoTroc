from django.db import models


class ListingImage(models.Model):
    listing = models.ForeignKey(
        "Listing", on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="listings/", blank=True, null=True)

    def __str__(self):
        return f"Image for {self.listing.title}"
