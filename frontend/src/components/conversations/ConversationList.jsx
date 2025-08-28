import React, { useContext, useEffect } from "react";
import ConversationListItem from "./ConversationListItem";
import { AuthContext } from "../../context/AuthContextProvider";
import useRequestResource from "../../hooks/useRequestResource";
import apiClient from "../../services/api";
import getCommonOptions from "../../helpers/axios/getCommonOptions";

function ConversationList({ activeConversationId, setActiveConversationId }) {
  const { user } = useContext(AuthContext);
  const { getResourceList, resourceList, updateResource } = useRequestResource({
    endpoint: "conversations",
    resourceLabel: "conversations",
  });
  useEffect(() => {
    getResourceList();
  }, [getResourceList]);

  const handleClick = (convo) => {
    setActiveConversationId(convo.id);
    apiClient
      .post(`/conversations/${convo.id}/mark_as_read/`, getCommonOptions())
      .then(() => {
        updateResource(convo.id, { has_unread_messages: false });
      })
      .catch((err) => {
        console.error("Error marking conversation as read:", err);
      });
  };

  const getOtherParticipant = (convo) => {
    return convo.participants.find((p) => p.user.username !== user.username);
  };

  if (!user) return null;
  return (
    <>
      <div className="p-3 border-b border-gray-500">
        <h2 className="font-bold h-5">Messages</h2>
      </div>
      <div>
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
              onClick={() => handleClick(convo)}
            />
          );
        })}
      </div>
    </>
  );
}

export default ConversationList;
