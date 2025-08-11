import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import { useSnackbar } from "notistack";
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";
import getCommonOptions from "../helpers/axios/gtCommonOptions";
import formatHttpApiError from "../helpers/formatHttpApiError";

function ListingSmallCard({ listing }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleInterestedClick = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `http://localhost:8000/api/listings/${listing.id}/contact_seller/`,
      {},
      getCommonOptions()
    );
    const data = response.data;
    navigate(`/messages/${data.conversation.id}`);
  };

  const handleReserveClick = async (e) => {
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
        enqueueSnackbar(formattedError, { variant: "error" });
      });
  };
  return (
    <div className="mt-8">
      <Link to={`/listings/${listing.id}`} className="group block">
        <div className="aspect-square w-full h-50 bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-all duration-300">
          <img
            src={
              listing.image ||
              "https://via.placeholder.com/300x300.png?text=No+Image"
            }
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="mt-2 h-16">
          <h3 className="text-sm truncate group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>
          <p className="mt-1 text-sm">{listing.jeton_value} 🪙</p>
        </div>
      </Link>
    </div>
  );
}

export default ListingSmallCard;
