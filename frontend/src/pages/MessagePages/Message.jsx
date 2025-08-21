import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ConversationPanel from "../../components/conversations/ConversationPanel";
import ConversationList from "../../components/conversations/ConversationList";

const MessagesPage = () => {
  const { conversationId: paramId } = useParams();
  const [activeConversationId, setActiveConversationId] = useState(null);
  useEffect(() => {
    if (paramId) {
      setActiveConversationId(parseInt(paramId, 10));
    }
  }, [paramId]);
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex border rounded-lg bg-white h-[calc(100vh-120px)]">
        <div className="w-1/3 border-r overflow-y-auto flex-shrink-0">
          <ConversationList
            activeConversationId={activeConversationId}
            setActiveConversationId={setActiveConversationId}
          />
        </div>
        <div className="w-2/3 flex flex-col">
          {activeConversationId ? (
            <ConversationPanel conversationId={activeConversationId} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a conversation to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MessagesPage;
