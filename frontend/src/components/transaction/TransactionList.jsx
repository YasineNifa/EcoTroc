import React, { useEffect } from "react";
import useRequestResource from "../../hooks/useRequestResource";

// A small helper component for the status badge
const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        styles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

function TransactionList({ selectedTransactionId, setSelectedTransactionId }) {
  const { getResourceList, resourceList } = useRequestResource({
    endpoint: "transactions",
    resourceLabel: "transactions",
  });

  useEffect(() => {
    getResourceList();
  }, []);

  return (
    <div className="flex flex-col mt-8">
      <div className="flex flex-col space-y-1 -mx-2 h-full overflow-y-auto">
        {resourceList.results?.map((transaction) => {
          const isSelected = transaction.id === selectedTransactionId;
          const transactionDate = new Date(
            transaction.transaction_date
          ).toLocaleDateString("fr-CH");

          return (
            <button
              key={transaction.id}
              onClick={() => setSelectedTransactionId(transaction.id)}
              className={`flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 text-left ${
                isSelected ? "bg-gray-200" : ""
              }`}
            >
              {/* Image */}
              <div className="flex-shrink-0">
                <img
                  src={
                    transaction.listing.image ||
                    "https://via.placeholder.com/40x40.png?text=..."
                  }
                  alt="transaction listing image"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>

              {/* Text Content */}
              <div className="ml-2 flex-grow min-w-0">
                <div className="font-semibold text-sm truncate">
                  {transaction.listing.title}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  {/* Jeton Value */}
                  <span className="font-bold text-blue-600">
                    {transaction.listing.jeton_value} 🪙
                  </span>

                  {/* Date */}
                  <span>{transactionDate}</span>
                </div>
              </div>

              {/* Status Badge on the far right */}
              <div className="ml-2">
                <StatusBadge status={transaction.status} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TransactionList;
