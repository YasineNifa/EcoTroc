import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";

const MessagesPage = () => {
  // Get the conversationId from the URL, if it exists
  const { conversationId: paramId } = useParams();
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  // When the URL parameter changes, update the selected conversation
  useEffect(() => {
    if (paramId) {
      setSelectedConversationId(parseInt(paramId, 10));
    }
  }, [paramId]);

  return (
    <div className="flex h-screen bg-gray-100 antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col py-8 pl-6 pr-6 w-64 bg-white flex-shrink-0">
          <div className="flex flex-row items-center justify-center h-12 w-full">
            <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                ></path>
              </svg>
            </div>
            <div className="ml-2 font-bold text-2xl">Messages</div>
          </div>
          <ConversationList
            selectedConversationId={selectedConversationId}
            setSelectedConversationId={setSelectedConversationId}
          />
        </div>

        <div className="flex flex-col flex-auto h-full p-6">
          {selectedConversationId ? (
            <ChatWindow conversationId={selectedConversationId} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a conversation to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
