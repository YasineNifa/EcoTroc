import { useState, useCallback, useEffect, useRef } from "react";
import apiClient from "../services/api";

export default function useInfiniteScrollResource({ endpoint }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMoreItems = useCallback(() => {
    // Prevent fetching if we're already loading or if there are no more pages
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    apiClient
      .get(`/${endpoint}/?page=${page}`)
      .then((res) => {
        // Append the new results to our existing list
        setItems((prevItems) => [...prevItems, ...res.data.results]);

        // If the 'next' field in the API response is null, we've reached the end
        if (res.data.next === null) {
          setHasMore(false);
        }

        // Prepare for the next page
        setPage((prevPage) => prevPage + 1);
      })
      .catch((err) => {
        // You can integrate your error formatting here
        setError("Failed to fetch data.");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [endpoint, page, loading, hasMore]);

  // Load the very first page when the hook is first used
  //   useEffect(() => {
  //     loadMoreItems();
  //   }, []); // The empty dependency array ensures this runs only once on mount

  const initialLoadCalled = useRef(false);

  useEffect(() => {
    // Only run the initial load if it hasn't been called yet
    // and there are no items in the list.
    if (!initialLoadCalled.current && items.length === 0) {
      loadMoreItems();
      initialLoadCalled.current = true;
    }
  }, []); // Keep the empty dependency array

  return { items, loadMoreItems, hasMore, loading, error };
}
