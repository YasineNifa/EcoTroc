import json
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if user.is_anonymous:
            access_token = self.scope.get("cookies", {}).get("access_token")
            if access_token:
                try:
                    token = AccessToken(access_token)
                    user = await User.objects.aget(id=token["user_id"])
                except Exception:
                    user = None

        if user is None or user.is_anonymous:
            await self.close()
        else:
            # Each user gets their own private "room" or group
            self.room_group_name = f"notifications_{user.id}"

            # Join the room
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # This method is called when the server sends a message to this group
    async def send_notification(self, event):
        notification_data = event["notification"]
        await self.send(text_data=json.dumps({"notification": notification_data}))

    async def notifications_updated(self, event):
        await self.send(text_data=json.dumps({"type": "notifications_updated"}))
