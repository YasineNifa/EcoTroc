// import React, { useState, useEffect, useContext } from "react";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import { AuthContext } from "../../context/AuthContextProvider";
// import apiClient from "../../services/api";
// import getCommonOptions from "../../helpers/axios/getCommonOptions";

// const NotificationBell = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [isOpen, setIsOpen] = useState(false);
//   const { isAuthenticated } = useContext(AuthContext);

//   // Fetch initial notifications via HTTP
//   const fetchInitialNotifications = () => {
//     apiClient.get("/notifications/", getCommonOptions()).then((res) => {
//       setNotifications(res.data.results);
//       setUnreadCount(res.data.results.filter((n) => !n.is_read).length);
//     });
//   };

//   useEffect(() => {
//     if (!isAuthenticated) return;

//     fetchInitialNotifications();

//     // --- WebSocket Connection ---
//     const socket = new WebSocket(
//       "ws://" + window.location.host + "/ws/notifications/"
//     );

//     socket.onopen = () => {
//       console.log("WebSocket connected!");
//     };

//     // Listen for messages from the server
//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("Notification received:", data.message);
//       // Add the new notification to the top of the list and update the count
//       setNotifications((prev) => [
//         { message: data.message, is_read: false },
//         ...prev,
//       ]);
//       setUnreadCount((prev) => prev + 1);
//     };

//     socket.onclose = () => {
//       console.error("WebSocket disconnected.");
//     };

//     return () => {
//       socket.close();
//     };
//   }, [isAuthenticated]);

//   const handleMarkAsRead = () => {
//     apiClient.post("/notifications/mark_all_as_read/").then(() => {
//       setUnreadCount(0);
//       setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
//     });
//   };

//   return (
//     // ... (your JSX remains the same)
//     <div className="relative">
//       <button onClick={() => setIsOpen(!isOpen)} className="relative">
//         <NotificationsIcon />
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4">
//           <h4 className="font-bold">Notifications</h4>
//           <button onClick={handleMarkAsRead} className="text-sm text-blue-500">
//             Mark all as read
//           </button>
//           <ul className="mt-2">
//             {notifications.map((notif, index) => (
//               <li
//                 key={index}
//                 className={`p-2 rounded ${!notif.is_read ? "bg-blue-50" : ""}`}
//               >
//                 {notif.message}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import NotificationsIcon from "@mui/icons-material/Notifications";
import apiClient from "../../services/api";
import getCommonOptions from "../../helpers/axios/getCommonOptions";
import { AuthContext } from "../../context/AuthContextProvider";

// const NotificationBell = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [isOpen, setIsOpen] = useState(false);
//   const { isAuthenticated } = useContext(AuthContext);
//   const navigate = useNavigate(); // Initialize the navigate function

//   const fetchNotifications = () => {
//     if (!isAuthenticated) return;
//     apiClient.get("/notifications/", getCommonOptions()).then((res) => {
//       setNotifications(res.data.results);
//       setUnreadCount(res.data.results.filter((n) => !n.is_read).length);
//     });
//   };

//   useEffect(() => {
//     if (!isAuthenticated) return;

//     fetchNotifications();
//     const socket = new WebSocket(
//       "ws://" + window.location.host + "/ws/notifications/"
//     );

//     socket.onmessage = (event) => {
//       // When a new notification comes in, refetch the whole list to get all data
//       fetchNotifications();
//     };

//     return () => {
//       socket.close();
//     };
//   }, [isAuthenticated]);

//   const handleNotificationClick = (notification) => {
//     let path = "/"; // Default fallback path

//     // Determine the correct path based on the notification type
//     switch (notification.notification_type) {
//       case "NEW_MESSAGE":
//         if (notification.content_object?.conversation) {
//           path = `/messages/${notification.content_object.conversation}`;
//         }
//         break;
//       case "NEW_PROPOSITION":
//       case "PROPOSITION_ACCEPTED":
//       case "PROPOSITION_REJECTED":
//         if (notification.content_object?.listing) {
//           // Navigate to the listing detail page for proposition-related notifications
//           path = `/listings/${notification.content_object.listing}`;
//         }
//         break;
//       // Add more cases for other notification types like NEW_REVIEW
//       default:
//         break;
//     }

//     navigate(path); // Perform the redirection
//     setIsOpen(false); // Close the dropdown
//   };

//   const handleMarkAsRead = (e) => {
//     e.stopPropagation(); // Prevent the dropdown from closing when clicking this button
//     apiClient.post("/notifications/mark_all_as_read/").then(() => {
//       setUnreadCount(0);
//       setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
//     });
//   };

//   return (
//     <div className="relative">
//       <button onClick={() => setIsOpen(!isOpen)} className="relative">
//         <NotificationsIcon />
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border">
//           <div className="flex justify-between items-center p-3 border-b">
//             <h4 className="font-bold">Notifications</h4>
//             {unreadCount > 0 && (
//               <button
//                 onClick={handleMarkAsRead}
//                 className="text-sm text-blue-500 hover:underline"
//               >
//                 Mark all as read
//               </button>
//             )}
//           </div>
//           <ul className="max-h-96 overflow-y-auto">
//             {notifications.length > 0 ? (
//               notifications.map((notif) => (
//                 <li
//                   key={notif.id}
//                   onClick={() => handleNotificationClick(notif)}
//                   className={`p-3 border-b cursor-pointer ${
//                     !notif.is_read
//                       ? "bg-blue-50 font-semibold"
//                       : "hover:bg-gray-50"
//                   }`}
//                 >
//                   {notif.message}
//                   <p className="text-xs text-gray-500 font-normal mt-1">
//                     {new Date(notif.created_at).toLocaleString("fr-CH")}
//                   </p>
//                 </li>
//               ))
//             ) : (
//               <li className="p-4 text-center text-gray-500">
//                 You have no notifications.
//               </li>
//             )}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize the navigate function

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

    socket.onmessage = (event) => {
      // When a new notification comes in, refetch the whole list to get all data
      fetchNotifications();
    };

    return () => {
      socket.close();
    };
  }, [isAuthenticated]);

  const handleNotificationClick = (notification) => {
    // --- FIX: Mark single notification as read ---
    if (!notification.is_read) {
      // This requires a backend endpoint: POST /api/notifications/{id}/mark_as_read/
      apiClient
        .post(`/notifications/${notification.id}/mark_as_read/`)
        .then(() => {
          // Update the state optimistically for instant UI feedback
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notification.id ? { ...n, is_read: true } : n
            )
          );
          setUnreadCount((prev) => prev - 1); // Decrement the unread count
        })
        .catch((err) =>
          console.error("Failed to mark notification as read", err)
        );
    }

    let path = "/"; // Default fallback path

    // Determine the correct path based on the notification type
    switch (notification.notification_type) {
      case "NEW_MESSAGE":
        if (notification.content_object?.conversation) {
          path = `/messages/${notification.content_object.conversation}`;
        }
        break;
      case "NEW_PROPOSITION":
      case "PROPOSITION_ACCEPTED":
      case "PROPOSITION_REJECTED":
        if (notification.content_object?.listing) {
          // Navigate to the listing detail page for proposition-related notifications
          path = `/listings/${notification.content_object.listing}`;
        }
        break;
      // Add more cases for other notification types like NEW_REVIEW
      default:
        break;
    }

    navigate(path); // Perform the redirection
    setIsOpen(false); // Close the dropdown
  };

  const handleMarkAsRead = (e) => {
    e.stopPropagation(); // Prevent the dropdown from closing when clicking this button
    apiClient
      .post("/notifications/mark_all_as_read/")
      .then(() => {
        // This optimistic update is correct and should work
        setUnreadCount(0);
        setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      })
      .catch((err) => {
        console.error("Failed to mark all notifications as read", err);
      });
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative">
        <NotificationsIcon />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
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
