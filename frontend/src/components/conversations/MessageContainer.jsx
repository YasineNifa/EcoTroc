import React from "react";
import NormalMessage from "./NormalMessage";
import OfferMessage from "./OfferMessage";

function MessageContainer({ msg, user }) {
  return msg.sender.user.username === user.username ? (
    // Current user's message (Right side)
    <div key={msg.id} className="col-start-6 col-end-13 p-3 rounded-lg">
      <div className="flex items-center justify-start flex-row-reverse">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
          {msg.message_type === "text" ? (
            <NormalMessage content={msg.content} />
          ) : (
            <OfferMessage
              offer={msg}
              onAccept={() => {}}
              onRefuse={() => {}}
              onCounterOffer={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  ) : (
    // Other user's message (Left side)
    <div key={msg.id} className="col-start-1 col-end-8 p-3 rounded-lg">
      <div className="flex flex-row items-center">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          {msg.sender.user.username.charAt(0).toUpperCase()}
        </div>
        <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
          {msg.message_type === "text" ? (
            <NormalMessage content={msg.content} />
          ) : (
            <OfferMessage
              offer={msg}
              onAccept={() => {}}
              onRefuse={() => {}}
              onCounterOffer={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageContainer;
