from django.contrib import admin
from api.models import (
    Category,
    Conversation,
    Listing,
    Message,
    Notification,
    Profile,
    Proposition,
    Review,
    Transaction,
)


admin.site.register(Category)
admin.site.register(Conversation)
admin.site.register(Listing)
admin.site.register(Message)
admin.site.register(Notification)
admin.site.register(Profile)
admin.site.register(Proposition)
admin.site.register(Review)
admin.site.register(Transaction)
