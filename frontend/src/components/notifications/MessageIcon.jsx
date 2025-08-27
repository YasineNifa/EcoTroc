import React from "react";
import { useNavigate } from "react-router-dom";
import InboxIcon from "@mui/icons-material/Inbox";
import { useNotificationSocket } from "../../hooks/useNotificationSocket";

const MessageIcon = () => {
  const { messageNotifications } = useNotificationSocket();
  const navigate = useNavigate();
  const unreadMessageCount = messageNotifications.length;

  return (
    <button onClick={() => navigate("/messages")} className="relative">
      <InboxIcon />
      {unreadMessageCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {unreadMessageCount}
        </span>
      )}
    </button>
  );
};

export default MessageIcon;
