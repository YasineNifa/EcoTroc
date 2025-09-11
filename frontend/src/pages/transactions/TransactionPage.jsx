import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TransactionList from "../../components/transactions/TransactionList";
import TransactionDetail from "./TransactionDetail";
import { useNavigate } from "react-router-dom";

const TransactionsPage = () => {
  const navigate = useNavigate();
  const { transactionId: paramId } = useParams();
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  useEffect(() => {
    if (paramId) {
      setSelectedTransactionId(parseInt(paramId, 10));
    }
  }, [paramId]);

  const handleTransactionSelect = (id) => {
    setSelectedTransactionId(id);
  };

  const onActionSuccess = () => {
    setSelectedTransactionId(null);
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col py-8 pl-6 pr-2 w-full md:w-80 bg-white flex-shrink-0">
          <div className="flex flex-row items-center justify-center h-12 w-full">
            <div className="ml-2 font-bold text-2xl">Transactions</div>
          </div>
          <TransactionList
            selectedTransactionId={selectedTransactionId}
            onTransactionSelect={handleTransactionSelect}
          />
        </div>

        <div className="flex flex-col flex-auto h-full p-6">
          <TransactionDetail
            transactionId={selectedTransactionId}
            onActionSuccess={onActionSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
