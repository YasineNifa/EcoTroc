import React from "react";
import useRequestResource from "../../hooks/useRequestResource";
import { AuthContext } from "../../context/AuthContextProvider";
import apiClient from "../../services/api";
import { useSnackbar } from "notistack";
import { useContext, useEffect } from "react";
import getCommonOptions from "../../helpers/axios/getCommonOptions";
import ParticipantDetail from "./ParticipantDetail";
import StatusBadge from "../../components/transactions/StatusBadge";
import { Link } from "react-router-dom";

const TransactionDetail = ({ transactionId, onActionSuccess }) => {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const {
    resource: transaction,
    getResource,
    loading,
    error,
  } = useRequestResource({ endpoint: `transactions` });

  useEffect(() => {
    if (transactionId) {
      getResource(transactionId);
    }
  }, [transactionId]);

  const handleConfirm = async () => {
    try {
      await apiClient.post(
        `/transactions/${transactionId}/confirm/`,
        getCommonOptions()
      );
      enqueueSnackbar("Confirmation successful!", { variant: "success" });
      getResource(transactionId);
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.detail || "Failed to confirm.", {
        variant: "error",
      });
    }
  };

  const handleCancel = async () => {
    try {
      await apiClient.post(`/transactions/${transactionId}/cancel/`);
      enqueueSnackbar("Transaction cancelled.", { variant: "info" });
      getResource(transactionId);
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.detail || "Failed to cancel.", {
        variant: "error",
      });
    }
  };

  if (!transactionId)
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a transaction to see details.
      </div>
    );
  if (loading) return <div>Loading...</div>;
  if (error || !transaction)
    return <div>Could not load transaction details.</div>;

  const seller = transaction.listing.owner;
  const buyer = transaction.buyer;
  const isUserTheBuyer = user?.profile?.id === buyer?.id;
  const hasUserConfirmed =
    (isUserTheBuyer && transaction.buyer_confirmed) ||
    (!isUserTheBuyer && transaction.seller_confirmed);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <div className="flex items-center justify-between mb-4 gap-10">
        <div>
          <h3 className="text-2xl font-bold mb-4">
            {transaction.listing.title}
          </h3>
          <Link
            to={`/listings/${transaction.listing.id}`}
            className="flex items-center mt-1 group"
          >
            <img
              src={transaction.listing.images[0].image}
              alt={transaction.listing.title}
              className="w-full h-64 object-contain rounded-lg mb-4"
            />
          </Link>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <ParticipantDetail title="Seller" profile={seller} />
            <ParticipantDetail title="Buyer" profile={buyer} />
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span className="capitalize">
                <StatusBadge status={transaction.status} />
              </span>
            </div>
            <div>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(transaction.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {transaction.status === "pending" && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-bold text-yellow-800">Action Required</h4>
          {hasUserConfirmed ? (
            <p className="text-yellow-700 mt-2">
              You have confirmed this transaction. Waiting for{" "}
              {isUserTheBuyer ? seller.user.username : buyer.user.username} to
              confirm.
            </p>
          ) : (
            <div>
              <p className="text-yellow-700 mt-2">
                Please confirm that the exchange has been completed.
              </p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Confirm Exchange
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Cancel Transaction
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {transaction.status === "completed" && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-bold text-green-800">Transaction Completed!</h4>
          <p className="text-green-700 mt-2">
            This exchange is complete. You can now leave a review.
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionDetail;
