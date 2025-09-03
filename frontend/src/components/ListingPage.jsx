import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../services/api";
import ItemCard from "./shared/ItemCard";
import getCommonOptions from "../helpers/axios/getCommonOptions";
import BrandFilter from "./Product/BrandFilter";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const brandQuery = searchParams.get("brand");

  // Ref for the IntersectionObserver
  const observer = useRef();

  // This callback attaches the observer to the last item in the list
  const lastListingElementRef = useCallback(
    (node) => {
      if (loading) return;
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

  useEffect(() => {
    setListings([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [searchQuery, brandQuery]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        status: "available",
      });
      if (searchQuery) params.set("search", searchQuery);
      if (brandQuery) params.set("brand", brandQuery);
      try {
        const response = await apiClient.get(
          `/listings/?${params.toString()}`,
          getCommonOptions()
        );
        setListings((prev) => {
          const newItems = response.data.results.filter(
            (newItem) => !prev.some((prevItem) => prevItem.id === newItem.id)
          );
          return [...prev, ...newItems];
        });
        setHasMore(response.data.next !== null);
      } catch (err) {
        setError("Failed to fetch listings.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [page, searchQuery, brandQuery, hasMore]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <BrandFilter />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {listings.map((item, index) => {
          if (listings.length === index + 1) {
            return (
              <div ref={lastListingElementRef} key={item.id}>
                <ItemCard item={item} />
              </div>
            );
          } else {
            return <ItemCard key={item.id} item={item} />;
          }
        })}
      </div>

      {loading && <p className="text-center mt-8">Loading more items...</p>}
      {error && <p className="text-center text-red-500 mt-8">{error}</p>}
      {!hasMore && (
        <p className="text-center text-gray-500 mt-8">You've seen it all! 👋</p>
      )}
    </div>
  );
};

export default ListingsPage;
