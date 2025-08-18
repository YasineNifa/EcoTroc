import React, { useEffect } from "react";
import ListListings from "../../components/ListListings";
import useRequestResource from "../../hooks/useRequestResource";

function FavoriteList() {
  // const { getResourceList, resourceList } = useRequestResource({
  //   endpoint: "listings/liked",
  //   resourceLabel: "liked",
  // });
  const { getResourceList, resourceList } = useRequestResource({
    endpoint: "listings",
  });
  // useEffect(() => {
  //   getResourceList();
  // }, [getResourceList]);
  useEffect(() => {
    getResourceList({ query: "?liked_by_user=true" });
  }, [getResourceList]);
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Favorite List</h1>
      <ListListings results={resourceList.results} />
    </>
  );
}

export default FavoriteList;
