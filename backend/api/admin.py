from django.contrib import admin
from api.models import Profile, Listing, Transaction, Conversation, Message


admin.site.register(Profile)
admin.site.register(Listing)
admin.site.register(Transaction)
admin.site.register(Conversation)
admin.site.register(Message)
