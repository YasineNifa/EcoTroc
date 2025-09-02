from django.db import models

from autoslug import AutoSlugField


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = AutoSlugField(populate_from="name", unique=True, always_update=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Brands"

    def __str__(self):
        return self.name