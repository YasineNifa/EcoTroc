import React, { useState, useEffect, useContext, use } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../services/api"; // Your centralized Axios client
import { AuthContext } from "../context/AuthContextProvider"; // Your auth context
import useRequestResource from "../hooks/useRequestResource";

// --- Helper Component for a single grid item ---
const ListingItem = ({ listing }) => (
  <Link to={`/listings/${listing.id}`} className="group block">
    {/* Image container with fixed aspect ratio and hover effects */}
    <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-all duration-300">
      <img
        src={
          listing.image ||
          "https://via.placeholder.com/300x300.png?text=No+Image"
        }
        alt={listing.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    {/* Text container with a fixed height to ensure alignment */}
    <div className="mt-2 h-16">
      <h3 className="text-sm text-gray-800 font-semibold truncate group-hover:text-blue-600 transition-colors">
        {listing.title}
      </h3>
      <p className="mt-1 text-lg font-bold text-gray-900">
        {listing.jeton_value} 🪙
      </p>
    </div>
  </Link>
);

const Profilex = () => {
  const { profile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("articles");
  const { getResourceList, resourceList } = useRequestResource({
    endpoint: "mylistings",
    resourceLabel: "mylistings",
  });

  useEffect(() => {
    getResourceList({ query: `?owner=${profile?.id}` });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container p-4 md:p-8 mx-auto max-w-6xl">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row items-center">
            <img
              src={
                profile.image ||
                `https://i.pravatar.cc/128?u=${profile.user.username}`
              }
              alt="User Avatar"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-200"
            />
            <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.user.username}
              </h1>
              <p className="text-gray-500">
                ★ 5.0 (23 evaluations) - placeholder
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-700">
              {profile.bio || "This user hasn't written a bio yet."}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("articles")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "articles"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Articles
              </button>
              <button
                onClick={() => setActiveTab("evaluations")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "evaluations"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Evaluations
              </button>
            </nav>
          </div>
        </div>

        <div className="mt-8">
          {activeTab === "articles" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {resourceList.results.length} articles
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {resourceList.results.map((listing) => (
                  <ListingItem key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          )}
          {activeTab === "evaluations" && (
            <div className="text-center p-10 bg-white rounded-lg shadow-sm">
              <p>Evaluations will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profilex;
