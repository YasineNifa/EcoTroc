import React, { useRef, useCallback } from "react";
import useInfiniteScrollResource from "../hooks/useInfiniteScrollResource";
import ListingSmallCard from "../components/ListingSmallCard";

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
        <h2 className="text-xl font-semibold mb-4">articles</h2>
        {/* <div className="bg-white p-6 rounded-lg shadow-sm"> */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {listings.map((listing, index) => {
            if (listings.length === index + 1) {
              return (
                <div ref={lastListingElementRef} key={listing.id}>
                  <ListingSmallCard listing={listing} />
                </div>
              );
            } else {
              return <ListingSmallCard listing={listing} key={listing.id} />;
            }
          })}
        </div>

        {loading && (
          <p className="text-center text-gray-500">Loading more items...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !hasMore && (
          <p className="text-center text-gray-500 mt-8">
            You've reached the end! 👋
          </p>
        )}
        {/* </div> */}
      </main>
    </div>
  );
};

export default HomePage;
