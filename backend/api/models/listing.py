from django.db import models

from api.models import Profile




# class Listing(models.Model):
#     STATUS_AVAILABLE = "available"
#     STATUS_RESERVED = "reserved"
#     STATUS_COMPLETED = "completed"
#     STATUS = (
#         (STATUS_AVAILABLE, "Available"),
#         (STATUS_RESERVED, "Reserved"),
#         (STATUS_COMPLETED, "Completed"),
#     )

#     title = models.CharField(max_length=255)
#     description = models.TextField()
#     jeton_value = models.PositiveIntegerField()
#     owner = models.ForeignKey(
#         Profile, on_delete=models.CASCADE, related_name="listings"
#     )
#     status = models.CharField(max_length=20, choices=STATUS, default=STATUS_AVAILABLE)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     image = models.ImageField(upload_to="listings/", blank=True, null=True)

#     def __str__(self):
#         return self.title

#     class Meta:
#         ordering = ["-created_at"]


class Listing(models.Model):
    class Condition(models.TextChoices):
        NEW_WITH_TAG = "new_with_tag", "New with tag"
        NEW_WITHOUT_TAG = "new_without_tag", "New without tag"
        VERY_GOOD = "very_good", "Very good"
        GOOD = "good", "Good"
        SATISFACTORY = "satisfactory", "Satisfactory"
    
    class Category(models.TextChoices):
        WOMEN = "women", "Women"
        MEN = "men", "Men"
        KIDS = "kids", "Kids"
        HOME = "home", "Home"
        ELECTRONICS = "electronics", "Electronics"
        ENTERTAINMENT = "entertainment", "Entertainment"
        HOBBIES = "hobbies", "Hobbies & collectibles"
        SPORTS = "sports", "Sports"

    class Status(models.TextChoices):
        AVAILABLE = "available", "Available"
        RESERVED = "reserved", "Reserved"
        COMPLETED = "completed", "Completed"

    title = models.CharField(max_length=255)
    description = models.TextField()
    token_value = models.PositiveIntegerField()
    owner = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="listings"
    )
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.AVAILABLE
    )
    image = models.ImageField(upload_to="listings/", blank=True, null=True)

    brand = models.CharField(max_length=100, blank=True)
    size = models.CharField(max_length=50, blank=True)
    condition = models.CharField(
        max_length=50, choices=Condition.choices, default=Condition.VERY_GOOD
    )
    category = models.CharField(
        max_length=50, choices=Category.choices, default=Category.HOME
    )
    likes = models.ManyToManyField(Profile, related_name='liked_listings', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def number_of_likes(self):
        return self.likes.count()

    class Meta:
        ordering = ["-created_at"]