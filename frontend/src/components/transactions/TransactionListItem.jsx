import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import StatusBadge from "./StatusBadge";
import { useNavigate } from "react-router-dom";

function TransactionListItem({
  transaction,
  selectedTransactionId,
  onTransactionSelect,
}) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isSelected = transaction.id === selectedTransactionId;

  const getOtherParticipant = (transaction) => {
    if (user?.profile?.id === transaction.buyer.id) {
      return transaction.listing.owner;
    }
    return transaction.buyer;
  };
  const otherParticipant = getOtherParticipant(transaction);

  const handleClick = () => {
    onTransactionSelect(transaction.id);
    navigate(`/transactions/${transaction.id}`);
  };
  return (
    <button
      key={transaction.id}
      onClick={() => handleClick()}
      className={`flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 text-left ${
        isSelected ? "bg-gray-200" : ""
      }`}
    >
      <img
        src={
          transaction.listing.images?.[0]?.image ||
          "[https://via.placeholder.com/40x40.png](https://via.placeholder.com/40x40.png)"
        }
        alt="Listing"
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="ml-2 flex-grow min-w-0">
        <div className="font-semibold text-sm truncate">
          {transaction.listing.title}
        </div>
        <div className="text-xs text-gray-500 truncate">
          vs. {otherParticipant.user.username}
        </div>
      </div>
      <div className="ml-2">
        <StatusBadge status={transaction.status} />
      </div>
    </button>
  );
}

export default TransactionListItem;
