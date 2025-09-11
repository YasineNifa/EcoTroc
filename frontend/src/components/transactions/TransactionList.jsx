import React, { useEffect } from "react";
import useRequestResource from "../../hooks/useRequestResource";
import TransactionListItem from "./TransactionListItem";

const TransactionList = ({ selectedTransactionId, onTransactionSelect }) => {
  const { resourceList, getResourceList } = useRequestResource({
    endpoint: "transactions",
  });

  useEffect(() => {
    getResourceList();
  }, []);

  return (
    <div className="flex flex-col mt-8">
      <div className="flex flex-col space-y-1 -mx-2 h-full overflow-y-auto">
        {resourceList.results?.map((transaction) => (
          <TransactionListItem
            transaction={transaction}
            selectedTransactionId={selectedTransactionId}
            onTransactionSelect={onTransactionSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
