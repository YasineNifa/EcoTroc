import React, { useContext, useEffect } from "react";
import ConversationListItem from "./ConversationListItem";
import { AuthContext } from "../../context/AuthContextProvider";
import useRequestResource from "../../hooks/useRequestResource";

function ConversationList({ activeConversationId, setActiveConversationId }) {
  const { user } = useContext(AuthContext);
  const { getResourceList, resourceList } = useRequestResource({
    endpoint: "conversations",
    resourceLabel: "conversations",
  });
  useEffect(() => {
    getResourceList();
  }, [getResourceList]);

  const getOtherParticipant = (convo) => {
    return convo.participants.find((p) => p.user.username !== user.username);
  };

  if (!user) return null; // Don't render if user data isn't loaded yet
  return (
    <div className="w-1/3 border-r overflow-y-auto flex-shrink-0">
      <div className="p-3 border-b">
        <h2 className="font-bold">Messages</h2>
      </div>
      <div>
        {/* {mockConversations.map((convo) => (
          <ConversationListItem
            key={convo.id}
            conversation={convo}
            isActive={convo.id === activeConversationId}
            onClick={() => setActiveConversationId(convo.id)}
          />
        ))} */}
        {resourceList.results.map((convo) => {
          const otherParticipant = getOtherParticipant(convo);
          if (!otherParticipant) return null;
          const isSelected = convo.id === activeConversationId;
          return (
            <ConversationListItem
              key={convo.id}
              conversation={convo}
              isActive={isSelected}
              otherParticipant={otherParticipant}
              onClick={() => setActiveConversationId(convo.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ConversationList;
