import React from "react";

const ListingCard = ({ listing }) => {
  // Fallback image if a listing doesn't have one
  const imageUrl =
    listing.image || "https://via.placeholder.com/600x400.png?text=No+Image";

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
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition">
              Save
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
              I'm Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
