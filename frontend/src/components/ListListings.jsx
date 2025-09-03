import React from "react";
import ItemCard from "./shared/ItemCard";

function ListListings({ results }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {results.map((item) => (
        <ItemCard item={item} key={item.id} />
      ))}
    </div>
  );
}

export default ListListings;
