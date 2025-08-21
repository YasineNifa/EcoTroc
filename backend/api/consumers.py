import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # A user must be authenticated to connect
        if self.scope["user"].is_anonymous:
            await self.close()
        else:
            # Each user gets their own private "room" or group
            self.room_group_name = f'notifications_{self.scope["user"].id}'

            # Join the room
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

    async def disconnect(self, close_code):
        # Leave the room
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # This method is called when the server sends a message to this group
    async def send_notification(self, event):
        message = event['message']
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))