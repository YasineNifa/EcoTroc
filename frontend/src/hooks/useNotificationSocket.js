import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import apiClient from "../services/api";
import getCommonOptions from "../helpers/axios/getCommonOptions";

export const useNotificationSocket = () => {
  const [allNotifications, setAllNotifications] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) return;

    // 1. Fetch initial notifications via HTTP
    apiClient.get("/notifications/", getCommonOptions()).then((res) => {
      setAllNotifications(res.data.results);
    });

    // 2. Open a single WebSocket connection
    const wsBase = import.meta.env.VITE_WS_URL || "wss://ecotroc-backend.onrender.com";
    const socket = new WebSocket(wsBase + "/ws/notifications/");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newNotification = data.notification;
      if (data.type === "notifications_updated") {
        apiClient.get("/notifications/", getCommonOptions()).then((res) => {
          setAllNotifications(res.data.results);
        });
      } else if (data.notification) {
        const newNotification = data.notification;
        setAllNotifications((prev) => [newNotification, ...prev]);
      }
    };

    socket.onclose = () => console.error("Notification socket closed.");

    // Cleanup on component unmount
    return () => socket.close();
  }, [isAuthenticated]);

  // Filter notifications for the message icon
  const messageNotifications = allNotifications.filter(
    (n) => n.notification_type === "NEW_MESSAGE" && !n.is_read
  );

  // Filter notifications for the general notification bell
  const generalNotifications = allNotifications.filter(
    (n) => n.notification_type !== "NEW_MESSAGE"
  );
  const unreadGeneralCount = generalNotifications.filter(
    (n) => !n.is_read
  ).length;

  return {
    messageNotifications,
    generalNotifications,
    unreadGeneralCount,
    setAllNotifications,
  };
};
