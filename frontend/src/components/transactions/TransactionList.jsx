import React, { useEffect, useContext } from "react";
import useRequestResource from "../../hooks/useRequestResource";
import { AuthContext } from "../../context/AuthContextProvider";
import StatusBadge from "./StatusBadge";

const TransactionList = ({ selectedTransactionId, onTransactionSelect }) => {
  const { resourceList, getResourceList } = useRequestResource({
    endpoint: "transactions",
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getResourceList();
  }, []); // Fetch on mount

  const getOtherParticipant = (transaction) => {
    if (user?.profile?.id === transaction.buyer.id) {
      return transaction.listing.owner; // If I'm the buyer, show the seller
    }
    return transaction.buyer; // Otherwise, I'm the seller, show the buyer
  };

  return (
    <div className="flex flex-col mt-8">
      <div className="flex flex-col space-y-1 -mx-2 h-full overflow-y-auto">
        {resourceList.results?.map((transaction) => {
          const isSelected = transaction.id === selectedTransactionId;
          const otherParticipant = getOtherParticipant(transaction);
          return (
            <button
              key={transaction.id}
              onClick={() => onTransactionSelect(transaction.id)}
              className={`flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 text-left ${
                isSelected ? "bg-gray-200" : ""
              }`}
            >
              <img
                src={
                  transaction.listing.image ||
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
        })}
      </div>
    </div>
  );
};

export default TransactionList;
