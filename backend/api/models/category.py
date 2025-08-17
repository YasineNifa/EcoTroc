from django.db import models

from autoslug import AutoSlugField


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)    
    slug = AutoSlugField(
        populate_from='name',
        unique=True,
        always_update=True,
        max_length=100
    )

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


    # class Category(models.TextChoices):
    #     WOMEN = "women", "Women"
    #     MEN = "men", "Men"
    #     KIDS = "kids", "Kids"
    #     HOME = "home", "Home"
    #     ELECTRONICS = "electronics", "Electronics"
    #     ENTERTAINMENT = "entertainment", "Entertainment"
    #     HOBBIES = "hobbies", "Hobbies & collectibles"
    #     SPORTS = "sports", "Sports"