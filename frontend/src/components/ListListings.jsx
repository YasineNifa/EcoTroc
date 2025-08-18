import React from "react";
import ItemCard from "./shared/ItemCard";
import { Link } from "react-router-dom";

function ListListings({ results }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {results.map((item) => (
        <Link key={item.id} to={`/listings/${item.id}`}>
          <ItemCard item={item} />
        </Link>
      ))}
    </div>
  );
}

export default ListListings;
