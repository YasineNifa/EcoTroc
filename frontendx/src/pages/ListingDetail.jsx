import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../services/api"; // Your centralized Axios client
import { AuthContext } from "../context/AuthContextProvider";
import getCommonOptions from "../helpers/axios/gtCommonOptions";
import { useSnackbar } from "notistack";
import formatHttpApiError from "../helpers/formatHttpApiError";

// --- Sub-component for the Seller Information Card ---
const SellerCard = ({ seller }) => (
  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
    <Link
      to={`/profile/${seller.user.username}`}
      className="flex items-center group"
    >
      <img
        src={
          seller.image || `https://i.pravatar.cc/48?u=${seller.user.username}`
        }
        alt="Seller Avatar"
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="ml-4">
        <p className="font-bold text-gray-800 group-hover:text-blue-600 transition">
          {seller.user.username}
        </p>
        <p className="text-sm text-gray-500">
          ★ 5.0 (23 reviews) - placeholder
        </p>
      </div>
    </Link>
  </div>
);

const ListingDetail = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user: loggedInUser } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleInterestedClick = async (e) => {
    e.preventDefault();
    const response = await apiClient.post(
      `http://localhost:8000/api/listings/${listing.id}/contact_seller/`,
      {},
      getCommonOptions()
    );
    const data = response.data;
    navigate(`/messages/${data.conversation.id}`);
  };

  const handleReserveClick = async (e) => {
    e.preventDefault();
    apiClient
      .post(
        `http://localhost:8000/api/listings/${listing.id}/reserve/`,
        {},
        getCommonOptions()
      )
      .then((res) => {
        const data = res.data;
        console.log("Transaction : ", data.transaction);
        navigate(`/transactions/${data.transaction.id}`);
      })
      .catch((err) => {
        console.log(err);
        const formattedError = formatHttpApiError(err);
        enqueueSnackbar(formattedError, { variant: "error" });
      });
  };

  useEffect(() => {
    if (!listingId) return;

    const fetchListing = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/listings/${listingId}/`);
        setListing(response.data);
      } catch (err) {
        console.error("Failed to fetch listing:", err);
        setError("This item could not be found.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  if (loading) {
    return (
      <div className="text-center p-10 font-semibold">Loading Listing...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-500 font-semibold">{error}</div>
    );
  }

  if (!listing) {
    return <div className="text-center p-10">Listing not found.</div>;
  }

  const isOwner = loggedInUser?.username === listing.owner.user.username;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container p-4 md:p-8 mx-auto max-w-6xl bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={
                  listing.image ||
                  "https://via.placeholder.com/600x600.png?text=EcoTroc"
                }
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="px-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {listing.title}
            </h1>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {listing.jeton_value} 🪙
            </p>

            <div className="mt-6 space-y-2 border-t border-b py-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Brand:</span>{" "}
                <span className="font-semibold">Carhartt (placeholder)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Condition:</span>{" "}
                <span className="font-semibold">
                  New with tags (placeholder)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Color:</span>{" "}
                <span className="font-semibold">Blue (placeholder)</span>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="font-semibold text-gray-800">{listing.title}</h2>
              <p className="text-gray-600 mt-2">{listing.description}</p>
            </div>

            {/* Action Buttons */}

            {!isOwner && (
              <div className="mt-8 space-y-3">
                <button
                  onClick={handleInterestedClick}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  I'm Interested
                </button>
                <button
                  onClick={handleReserveClick}
                  className="w-full bg-gray-100 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-200 transition"
                >
                  Reserve
                </button>
              </div>
            )}

            <SellerCard seller={listing.owner} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
