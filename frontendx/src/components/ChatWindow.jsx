import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import useRequestResource from "../hooks/useRequestResource";

const ChatWindow = ({ conversationId }) => {
  const [newMessage, setNewMessage] = useState("");
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);
  const { getResourceList, resourceList, addResource } = useRequestResource({
    endpoint: `conversations/${conversationId}/messages`,
    resourceLabel: "messages",
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    getResourceList();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [resourceList]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    addResource(
      {
        content: newMessage,
      },
      () => {
        getResourceList(); // Re-fetch the messages to include the new one
        setNewMessage("");
      }
    );
  };

  if (!user) return null;

  return (
    <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-white h-full p-4">
      <div className="flex flex-col h-full overflow-x-auto mb-4">
        <div className="flex flex-col h-full">
          <div className="grid grid-cols-12 gap-y-2">
            {resourceList.results?.map((msg) =>
              msg.sender.user.username === user.username ? (
                // Current user's message (Right side)
                <div
                  key={msg.id}
                  className="col-start-6 col-end-13 p-3 rounded-lg"
                >
                  <div className="flex items-center justify-start flex-row-reverse">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                      <div>{msg.content}</div>
                    </div>
                  </div>
                </div>
              ) : (
                // Other user's message (Left side)
                <div
                  key={msg.id}
                  className="col-start-1 col-end-8 p-3 rounded-lg"
                >
                  <div className="flex flex-row items-center">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                      {msg.sender.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                      <div>{msg.content}</div>
                    </div>
                  </div>
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
        <div className="flex-grow ml-4">
          <form onSubmit={handleSendMessage} className="relative w-full">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
            />
          </form>
        </div>
        <div className="ml-4">
          <button
            onClick={handleSendMessage}
            className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
          >
            <span>Send</span>
            <span className="ml-2">
              <svg
                className="w-4 h-4 transform rotate-45 -mt-px"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
