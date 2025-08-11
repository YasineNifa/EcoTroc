import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import apiClient from "../services/api";
import { useSnackbar } from "notistack";

import axios from "axios";
import getCommonOptions from "../helpers/axios/gtCommonOptions";
import formatHttpApiError from "../helpers/formatHttpApiError";

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();
  // Fallback image if a listing doesn't have one
  const { profile } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const imageUrl =
    listing.image || "https://via.placeholder.com/600x400.png?text=No+Image";

  const handleInterestedClick = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `http://localhost:8000/api/listings/${listing.id}/contact_seller/`,
      {},
      getCommonOptions()
    );
    const data = response.data;
    console.log("Conversation : ", data.conversation);
    navigate(`/messages/${data.conversation.id}`);
  };

  // const handleReserveClick = async (e) => {
  //   console.log("Clicked Reserve");
  //   e.preventDefault();
  //   const response = await axios.post(
  //     `http://localhost:8000/api/listings/${listing.id}/reserve/`,
  //     {},
  //     getCommonOptions()
  //   );
  //   const data = response.data;
  //   console.log("Transaction : ", data.transaction);
  //   navigate(`/transactions/${data.transaction.id}`);
  // };

  const handleReserveClick = async (e) => {
    console.log("Clicked Reserve");
    e.preventDefault();
    axios
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
        enqueueSnackbar(formattedError);
      });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      {/* User Info Header */}
      <div className="p-4 flex items-center">
        <img
          src={
            listing?.owner?.image ||
            `https://i.pravatar.cc/40?u=${listing?.owner?.user?.username}`
          }
          alt={`${listing?.owner?.user?.username}'s avatar`}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <p className="font-semibold text-gray-800">
            {listing?.owner?.user?.username}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(listing?.created_at).toLocaleDateString("fr-CH")}
          </p>
        </div>
      </div>

      {/* Listing Image */}
      <img
        src={imageUrl}
        alt={listing?.title}
        className="w-full h-auto object-cover"
      />

      {/* Listing Info & Actions */}
      <div className="p-4 pb-2">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {listing.title}
        </h3>
        <p className="text-gray-700 mb-4">{listing.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            {listing.jeton_value} 🪙
          </span>
          {profile &&
            listing &&
            (profile.user.username !== listing.owner.user.username ? (
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                  onClick={handleReserveClick}
                >
                  Reserve
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                  onClick={handleInterestedClick}
                >
                  I'm Interested
                </button>
              </div>
            ) : (
              ""
            ))}
          {/* <div className="flex space-x-2">
            {profile &&
              listing &&
              (profile.user.username !== listing.owner.user.username ? (
                <button
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                  onClick={handleInterestedClick}
                >
                  I'm Interested
                </button>
              ) : (
                ""
              ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
