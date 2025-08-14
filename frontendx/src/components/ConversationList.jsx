import React, { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import useRequestResource from "../hooks/useRequestResource";

const ConversationList = ({
  selectedConversationId,
  setSelectedConversationId,
}) => {
  const { user } = useContext(AuthContext);
  const { getResourceList, resourceList } = useRequestResource({
    endpoint: "conversations",
    resourceLabel: "conversations",
  });

  useEffect(() => {
    getResourceList();
  }, []);

  const getOtherParticipant = (convo) => {
    return convo.participants.find((p) => p.user.username !== user.username);
  };

  if (!user) return null; // Don't render if user data isn't loaded yet
  return (
    <div className="flex flex-col mt-8">
      <div className="flex flex-col space-y-1 -mx-2 h-full overflow-y-auto">
        {resourceList.results?.map((convo) => {
          const otherParticipant = getOtherParticipant(convo);
          if (!otherParticipant) return null;

          const isSelected = convo.id === selectedConversationId;
          return (
            <button
              key={convo.id}
              onClick={() => setSelectedConversationId(convo.id)}
              className={`flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 ${
                isSelected ? "bg-gray-200" : ""
              }`}
            >
              <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                <img
                  src={
                    convo.listing.image ||
                    otherParticipant.profile?.image ||
                    `https://i.pravatar.cc/32?u=${otherParticipant.user.username}`
                  }
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="ml-2 text-sm font-semibold truncate">
                {convo.listing.title} - {otherParticipant.user.username}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
