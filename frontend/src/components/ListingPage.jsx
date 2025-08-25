import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import apiClient from "../services/api"; // Make sure you have a centralized apiClient
import ItemCard from "./shared/ItemCard"; // Your existing ItemCard component
import getCommonOptions from "../helpers/axios/getCommonOptions";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // To know if there are more pages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref for the IntersectionObserver
  const observer = useRef();

  // This callback attaches the observer to the last item in the list
  const lastListingElementRef = useCallback(
    (node) => {
      if (loading) return; // Don't do anything if we're already loading
      if (observer.current) observer.current.disconnect(); // Disconnect old observer

      observer.current = new IntersectionObserver((entries) => {
        // If the last item is visible and there are more pages, load the next page
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // This effect fetches data whenever the 'page' state changes
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(
          `/listings/?page=${page}&status=available`,
          getCommonOptions()
        );

        // Append new listings to the existing list
        setListings((prevListings) => {
          // Prevent duplicates by checking if the item already exists
          const newItems = response.data.results.filter(
            (newItem) =>
              !prevListings.some((prevItem) => prevItem.id === newItem.id)
          );
          return [...prevListings, ...newItems];
        });

        // If the API response's 'next' field is null, we've reached the end
        if (response.data.next === null) {
          setHasMore(false);
        }
      } catch (err) {
        setError("Failed to fetch listings.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (hasMore) {
      fetchListings();
    }
  }, [page]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {listings.map((item, index) => {
          // If this is the last item, attach the ref to it
          if (listings.length === index + 1) {
            return (
              <div ref={lastListingElementRef} key={item.id}>
                <Link to={`/listings/${item.id}`}>
                  <ItemCard item={item} />
                </Link>
              </div>
            );
          } else {
            return (
              <Link key={item.id} to={`/listings/${item.id}`}>
                <ItemCard item={item} />
              </Link>
            );
          }
        })}
      </div>

      {/* UI Feedback for the user */}
      {loading && <p className="text-center mt-8">Loading more items...</p>}
      {error && <p className="text-center text-red-500 mt-8">{error}</p>}
      {!hasMore && (
        <p className="text-center text-gray-500 mt-8">You've seen it all! 👋</p>
      )}
    </div>
  );
};

export default ListingsPage;
