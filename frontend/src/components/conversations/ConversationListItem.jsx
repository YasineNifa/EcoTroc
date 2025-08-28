import Token from "../ui/Token";
import TimeAgo from "./TimeAgo";

const ConversationListItem = ({
  conversation,
  isActive,
  onClick,
  otherParticipant,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 p-3 cursor-pointer ${
        isActive ? "bg-gray-100" : "hover:bg-gray-50"
      }`}
    >
      {conversation.listing.image ? (
        <img
          src={
            otherParticipant.image ||
            `https://placehold.co/40x40/E2E8F0/4A5568?text=${otherParticipant.user.username}`
          }
          alt="Image"
          className="w-12 h-12 rounded-full flex-shrink-0"
        />
      ) : (
        <div
          className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xl ${
            "bg-green-500" || "bg-gray-400"
          }`}
        >
          {otherParticipant.user.username}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <p
            className={`font-bold text-sm ${
              conversation.unread ? "text-black" : "text-gray-800"
            }`}
          >
            {otherParticipant.user.username}
          </p>
          <p className="text-xs text-gray-400 flex-shrink-0">
            <TimeAgo date={conversation.created_at} />
          </p>
        </div>
        <div className="flex justify-between items-end mt-1">
          <p
            className={`w-[80%] text-sm truncate pr-2 ${
              conversation.has_unread_messages
                ? "text-black font-semibold"
                : "text-gray-500"
            }`}
          >
            {conversation.last_message?.content}
          </p>
          <div className="w-[20%] flex justify-between items-center">
            <img
              src={conversation.listing.image}
              alt="item"
              className="w-8 h-8 rounded-sm flex-shrink-0"
            />
            <p className="text-xs text-gray-400 flex-shrink-0">
              {conversation.listing.token_value} <Token />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationListItem;
