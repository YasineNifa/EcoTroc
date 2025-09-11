import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import apiClient from "../../services/api";
import getCommonOptions from "../../helpers/axios/getCommonOptions";
import { AuthContext } from "../../context/AuthContextProvider";
import { useNotificationSocket } from "../../hooks/useNotificationSocket";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { unreadGeneralCount, setAllNotifications } = useNotificationSocket();

  const fetchNotifications = () => {
    if (!isAuthenticated) return;
    apiClient.get("/notifications/", getCommonOptions()).then((res) => {
      setNotifications(res.data.results);
      setUnreadCount(res.data.results.filter((n) => !n.is_read).length);
    });
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchNotifications();
    const socket = new WebSocket(
      "ws://" + window.location.host + "/ws/notifications/"
    );

    socket.onmessage = () => {
      //event arg
      fetchNotifications();
    };

    return () => {
      socket.close();
    };
  }, [isAuthenticated]);

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      apiClient
        .post(
          `/notifications/${notification.id}/mark_as_read/`,
          getCommonOptions()
        )
        .then(() => {
          setAllNotifications((prev) =>
            prev.map((n) =>
              n.id === notification.id ? { ...n, is_read: true } : n
            )
          );
        })
        .catch((err) =>
          console.error("Failed to mark notification as read", err)
        );
    }

    let path = "/";
    switch (notification.notification_type) {
      case "NEW_MESSAGE":
        if (notification.content_object?.conversation) {
          path = `/messages/${notification.content_object.conversation}`;
        }
        break;
      case "NEW_TRANSACTION":
        path = `/transactions/${notification.content_object.id}`;
        break;
      case "NEW_PROPOSITION":
      case "PROPOSITION_ACCEPTED":
      case "PROPOSITION_REJECTED":
        if (notification.content_object?.listing) {
          path = `/listings/${notification.content_object.listing}`;
        }
        break;
      default:
        break;
    }

    navigate(path);
    setIsOpen(false);
  };

  const handleMarkAsRead = (e) => {
    e.stopPropagation(); // Prevent the dropdown from closing when clicking this button
    apiClient
      .post("/notifications/mark_all_as_read/", getCommonOptions())
      .then(() => {
        // setUnreadCount(0);
        // setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
        setAllNotifications((prev) =>
          prev.map((n) =>
            n.notification_type !== "NEW_MESSAGE" ? { ...n, is_read: true } : n
          )
        );
      })
      .catch((err) => {
        console.error("Failed to mark all notifications as read", err);
      });
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative">
        <NotificationsIcon />
        {/* {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )} */}
        {unreadGeneralCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadGeneralCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border">
          <div className="flex justify-between items-center p-3 border-b">
            <h4 className="font-bold">Notifications</h4>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAsRead}
                className="text-sm text-blue-500 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <li
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 border-b cursor-pointer ${
                    !notif.is_read
                      ? "bg-blue-50 font-semibold"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {notif.message}
                  <p className="text-xs text-gray-500 font-normal mt-1">
                    {new Date(notif.created_at).toLocaleString("fr-CH")}
                  </p>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">
                You have no notifications.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
