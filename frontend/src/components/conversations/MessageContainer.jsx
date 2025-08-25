// import React from "react";
// import NormalMessage from "./NormalMessage";
// import OfferMessage from "./OfferMessage";
// import apiClient from "../../services/api";
// import { useSnackbar } from "notistack";
// import getCommonOptions from "../../helpers/axios/getCommonOptions";

// function MessageContainer({ msg, user }) {
//   const { enqueueSnackbar } = useSnackbar();
//   const handleAccept = (propositionId) => {
//     apiClient
//       .post(`/propositions/${propositionId}/accept/`, getCommonOptions())
//       .then(() => {
//         enqueueSnackbar("Offer accepted!", { variant: "success" });
//         if (onActionSuccess) onActionSuccess(); // Callback to refresh the message list
//       })
//       .catch((err) => {
//         const errorMsg =
//           err.response?.data?.detail || "Failed to accept offer.";
//         enqueueSnackbar(errorMsg, { variant: "error" });
//       });
//   };

//   const handleRefuse = (propositionId) => {
//     apiClient
//       .post(`/propositions/${propositionId}/reject/`, getCommonOptions())
//       .then(() => {
//         enqueueSnackbar("Offer rejected.", { variant: "info" });
//         if (onActionSuccess) onActionSuccess();
//       })
//       .catch((err) => {
//         const errorMsg =
//           err.response?.data?.detail || "Failed to reject offer.";
//         enqueueSnackbar(errorMsg, { variant: "error" });
//       });
//   };

//   const handleCounterOffer = (propositionId) => {
//     // This would typically open a modal to input a new amount
//     console.log("Counter offer for proposition ID:", propositionId);
//     enqueueSnackbar("Counter-offer functionality is not yet implemented.", {
//       variant: "info",
//     });
//   };

//   const isMyMessage = msg.sender.user.username === user.username;
//   const isOffer = msg.message_type === "offer";

//   return msg.sender.user.username === user.username ? (
//     <div key={msg.id} className="col-start-6 col-end-13 p-3 rounded-lg">
//       <div className="flex items-center justify-start flex-row-reverse">
//         <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
//           <img src={msg.sender.image} alt="Image" className="rounded-full" />
//         </div>
//         <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
//           {msg.message_type === "text" ? (
//             <NormalMessage content={msg.content} />
//           ) : (
//             <OfferMessage
//               offer={msg}
//               onAccept={() => handleAccept(msg.proposition.id)}
//               onRefuse={() => handleRefuse(msg.proposition.id)}
//               onCounterOffer={() => handleCounterOffer(msg.proposition.id)}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   ) : (
//     // Other user's message (Left side)
//     <div key={msg.id} className="col-start-1 col-end-8 p-3 rounded-lg">
//       <div className="flex flex-row items-center">
//         <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
//           {/* {msg.sender.user.username.charAt(0).toUpperCase()} */}
//           <img src={msg.sender.image} alt="Image" className="rounded-full" />
//         </div>
//         <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
//           {msg.message_type === "text" ? (
//             <NormalMessage content={msg.content} />
//           ) : (
//             <OfferMessage
//               offer={msg}
//               onAccept={() => handleAccept(msg.proposition.id)}
//               onRefuse={() => handleRefuse(msg.proposition.id)}
//               onCounterOffer={() => handleCounterOffer(msg.proposition.id)}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MessageContainer;

import React from "react";
import NormalMessage from "./NormalMessage";
import OfferMessage from "./OfferMessage";
import SentOfferMessage from "./SentOfferMessage"; // Import the new component
import apiClient from "../../services/api";
import { useSnackbar } from "notistack";
import getCommonOptions from "../../helpers/axios/getCommonOptions";

function MessageContainer({ msg, user, onActionSuccess }) {
  // Added onActionSuccess prop
  const { enqueueSnackbar } = useSnackbar();

  const handleAccept = (propositionId) => {
    apiClient
      .post(`/propositions/${propositionId}/accept/`, getCommonOptions())
      .then(() => {
        enqueueSnackbar("Offer accepted!", { variant: "success" });
        if (onActionSuccess) onActionSuccess();
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.detail || "Failed to accept offer.";
        enqueueSnackbar(errorMsg, { variant: "error" });
      });
  };

  const handleRefuse = (propositionId) => {
    apiClient
      .post(`/propositions/${propositionId}/reject/`, getCommonOptions())
      .then(() => {
        enqueueSnackbar("Offer rejected.", { variant: "info" });
        if (onActionSuccess) onActionSuccess();
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.detail || "Failed to reject offer.";
        enqueueSnackbar(errorMsg, { variant: "error" });
      });
  };

  const handleCounterOffer = (propositionId) => {
    console.log("Counter offer for proposition ID:", propositionId);
    enqueueSnackbar("Counter-offer functionality is not yet implemented.", {
      variant: "info",
    });
  };

  const isMyMessage = msg.sender.user.username === user.username;
  const isOffer = msg.message_type === "offer";

  // --- Main Logic ---
  // Determine which component to render based on message type and sender
  let messageContent;
  if (isOffer) {
    if (isMyMessage) {
      // If I sent the offer, show the "Pending" status
      messageContent = <SentOfferMessage offer={msg} />;
    } else {
      // If I received the offer, show the action buttons
      messageContent = (
        <OfferMessage
          offer={msg}
          onAccept={() => handleAccept(msg.proposition.id)}
          onRefuse={() => handleRefuse(msg.proposition.id)}
          onCounterOffer={() => handleCounterOffer(msg.proposition.id)}
        />
      );
    }
  } else {
    // If it's a normal message, just show the text
    messageContent = <NormalMessage content={msg.content} />;
  }

  return (
    <div
      key={msg.id}
      className={`col-end-13 p-3 rounded-lg ${
        isMyMessage ? "col-start-6" : "col-start-1"
      }`}
    >
      <div
        className={`flex items-center ${
          isMyMessage ? "justify-start flex-row-reverse" : "flex-row"
        }`}
      >
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          <img src={msg.sender.image} alt="Avatar" className="rounded-full" />
        </div>
        <div
          className={`relative text-sm py-2 px-4 shadow rounded-xl ${
            isMyMessage ? "mr-3 bg-indigo-100" : "ml-3 bg-white"
          }`}
        >
          {messageContent}
        </div>
      </div>
    </div>
  );
}

export default MessageContainer;
