import { useEffect, useState } from "react";
import ConversationListItem from "../../components/conversations/ConversationListItem";
import ConversationPanel from "../../components/conversations/ConversationPanel";
import { useParams } from "react-router-dom";
import ConversationList from "../../components/conversations/ConversationList";

const mockConversations = [
  {
    id: 1,
    user: { name: "laurague808", avatarLetter: "L" },
    lastMessage: "No sorry",
    time: "il y a 4 heures",
    unread: true,
    itemPrice: "77,00 €",
    itemImageUrl: "https://placehold.co/40x40/FBBF24/422006?text=",
  },
  {
    id: 2,
    user: {
      name: "luckyetik",
      avatarUrl: "https://placehold.co/48x48/FBCFE8/831843?text=L",
    },
    lastMessage: "70,00 €",
    time: "il y a 2 semaines",
    itemPrice: "70,00 €",
    itemImageUrl: "https://placehold.co/40x40/A78BFA/3B0764?text=",
  },
];

const mockActiveConversation = {
  user: {
    name: "laurague808",
    location: "Italie, Sant Urbano",
    avatarLetter: "L",
  },
  item: {
    name: "Short Patagonia Dirt Craft",
    price: "77,00 €",
    total: "81,55 €",
    imageUrl: "https://placehold.co/40x40/FBBF24/422006?text=Item",
  },
  messages: [
    {
      id: 1,
      type: "text",
      sender: "laurague808",
      text: "Bonjour, je suis laurague808. Is this item still available for sale?",
      time: "il y a 4 heures",
    },
    {
      id: 2,
      type: "offer",
      sender: "laurague808",
      price: "50,00 €",
      time: "il y a 4 heures",
    },
    {
      id: 3,
      type: "text",
      sender: "me",
      text: "No sorry",
      time: "il y a 4 heures",
    },
  ],
};
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
      <div className="flex border bg-white h-[calc(100vh-120px)]">
        <ConversationList
          activeConversationId={activeConversationId}
          setActiveConversationId={setActiveConversationId}
        />
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
