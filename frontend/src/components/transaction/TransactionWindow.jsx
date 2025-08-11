import React, { useEffect, useContext } from "react";
import useRequestResource from "../../hooks/useRequestResource";
import { AuthContext } from "../../context/AuthContextProvider";
import apiClient from "../../services/api";
import { useSnackbar } from "notistack";
import getCommonOptions from "../../helpers/axios/gtCommonOptions";

// Reusable StatusBadge component from the previous step
const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
        styles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

// Reusable component to display a user profile in the transaction
const ParticipantCard = ({ title, profile }) => (
  <div>
    <h4 className="text-sm font-semibold text-gray-600">{title}</h4>
    <div className="flex items-center mt-2">
      <img
        src={
          profile?.image ||
          `https://i.pravatar.cc/40?u=${profile?.user?.username}`
        }
        alt="participant avatar"
        className="w-10 h-10 rounded-full object-cover"
      />
      <span className="ml-3 font-medium text-gray-800">
        {profile?.user?.username}
      </span>
    </div>
  </div>
);

function TransactionWindow({ transactionId }) {
  // Get the logged-in user from context to check who can confirm
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  // Use your hook to fetch a single transaction resource
  const {
    resource: transaction,
    getResource,
    loading,
    error,
  } = useRequestResource({
    endpoint: `transactions`,
    resourceLabel: "Transaction",
  });

  // Fetch the specific transaction whenever the ID changes
  useEffect(() => {
    if (transactionId) {
      getResource(transactionId);
    }
  }, [transactionId, getResource]);

  const handleConfirm = async () => {
    try {
      await apiClient.post(
        `/transactions/${transactionId}/confirm/`,
        {},
        getCommonOptions()
      );
      enqueueSnackbar("Confirmation successful!", { variant: "success" });
      // Refresh the transaction data to show the updated status
      getResource(transactionId);
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || "Failed to confirm transaction.";
      enqueueSnackbar(errorMsg, { variant: "error" });
    }
  };

  // --- Render States ---
  if (!transactionId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>Select a transaction to see the details.</p>
      </div>
    );
  }

  if (loading) return <p className="p-4">Loading transaction...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!transaction) return null;

  // Determine if the current user can confirm this transaction
  const sellerProfile = transaction?.listing.owner;
  const buyerProfile = transaction?.buyer;
  const isUserTheBuyer = user?.profile?.id === buyerProfile.id;
  const isUserTheSeller = user?.profile?.id === sellerProfile.id;

  // A user has confirmed if their flag is true
  const hasUserConfirmed =
    (isUserTheBuyer && transaction.buyer_confirmed) ||
    (isUserTheSeller && transaction.seller_confirmed);
  const canConfirm = transaction.status === "pending" && !hasUserConfirmed;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Listing Details */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {transaction.listing.title}
          </h3>
          <img
            src={
              transaction.listing.image ||
              "https://via.placeholder.com/600x400.png?text=No+Image"
            }
            alt={transaction.listing.title}
            className="w-full h-64 object-cover rounded-lg bg-gray-100 mb-4"
          />
          <p className="text-gray-600">{transaction.listing.description}</p>
        </div>

        {/* Right Column: Transaction & Participant Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-bold mb-2">Transaction Details</h4>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Status:</span>
              <StatusBadge status={transaction.status} />
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Value:</span>
              <span className="font-bold text-blue-600">
                {transaction.listing.jeton_value} 🪙
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date:</span>
              <span className="text-gray-800">
                {new Date(transaction.transaction_date).toLocaleDateString(
                  "fr-CH"
                )}
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <h4 className="text-lg font-bold mb-2">Participants</h4>
            <ParticipantCard title="Seller" profile={sellerProfile} />
            <ParticipantCard title="Buyer" profile={buyerProfile} />
          </div>

          {/* Confirmation Button */}
          {canConfirm && (
            <button
              onClick={handleConfirm}
              className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition"
            >
              Confirm Exchange
            </button>
          )}

          {transaction.status === "pending" && hasUserConfirmed && (
            <div className="text-center p-3 bg-blue-50 text-blue-700 rounded-lg">
              Waiting for the other party to confirm.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionWindow;
