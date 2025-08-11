import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TransactionList from "../components/transaction/TransactionList";
import TransactionWindow from "../components/transaction/TransactionWindow";

function TransactionPage() {
  const { transactionId: paramId } = useParams();
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  useEffect(() => {
    if (paramId) {
      setSelectedTransactionId(parseInt(paramId, 10));
    }
  }, [paramId]);

  return (
    <div className="flex h-screen bg-gray-100 antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        {/* Left Column: Transaction List */}
        <div className="flex flex-col bg-white flex-shrink-0 py-8 pl-6 pr-6 w-auto">
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
            <div className="ml-2 font-bold text-2xl">Transactions</div>
          </div>
          <TransactionList
            selectedTransactionId={selectedTransactionId}
            setSelectedTransactionId={setSelectedTransactionId}
          />
        </div>

        {/* Right Column: Transaction Window */}
        <div className="flex flex-col flex-auto h-full p-6">
          {selectedTransactionId ? (
            <TransactionWindow transactionId={selectedTransactionId} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a transaction to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionPage;
