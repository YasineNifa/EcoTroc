import React, { useRef, useCallback } from "react";
import ListingCard from "../components/ListingCard";
import useInfiniteScrollResource from "../hooks/useInfiniteScrollResource";

const HomePage = () => {
  const {
    items: listings,
    loadMoreItems,
    hasMore,
    loading,
    error,
  } = useInfiniteScrollResource({ endpoint: "listings" });

  const observer = useRef();

  const lastListingElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        // If the last element is visible and there are more items to load, call our hook's function
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMoreItems]
  ); // Dependencies now come from the hook

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container p-4 md:p-8 mx-auto max-w-6xl">
        {listings.map((listing, index) => {
          if (listings.length === index + 1) {
            return (
              <div ref={lastListingElementRef} key={listing.id}>
                <ListingCard listing={listing} />
              </div>
            );
          } else {
            return <ListingCard key={listing.id} listing={listing} />;
          }
        })}

        {loading && (
          <p className="text-center text-gray-500">Loading more items...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !hasMore && (
          <p className="text-center text-gray-500 mt-8">
            You've reached the end! 👋
          </p>
        )}
      </main>
    </div>
  );
};

export default HomePage;
