import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextProvider";
import Token from "../ui/Token";
import LikeButton from "../LikeButton";

const ItemCard = ({ item }) => {
  const { profile } = useContext(AuthContext);
  const isOwner = profile?.id === item.owner.id;
  const isAvailable = item.status === "available";

  return (
    <Link to={`/listings/${item.id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden border border-slate-200 h-full flex flex-col">
        <div className="relative">
          <div className="aspect-square w-full bg-slate-100">
            <img
              alt={item.title}
              className="w-full h-full object-cover"
              src={item.images?.length > 0 ? item.images[0].image : ""}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/400x400/e2e8f0/4a5568?text=EcoTroc";
              }}
            />
          </div>

          {!isAvailable && (
            <div className="absolute bottom-0 left-0 w-full bg-green-600 bg-opacity-80 py-1 text-center z-10">
              <span className="text-white text-xs font-bold uppercase tracking-widest">
                {item.status === "completed" ? "Sold" : "Reserved"}
              </span>
            </div>
          )}
        </div>

        <div className="p-3 flex-grow flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-bold text-slate-800 flex items-center">
              {item.token_value}
              <Token />
            </p>
            {item.number_of_likes !== undefined && isAvailable && (
              <LikeButton item={item} isOwner={isOwner} />
            )}
          </div>

          <div className="mt-2">
            <p
              className="text-sm text-slate-500 truncate"
              title={item.brand || "No brand"}
            >
              {item.brand || "No brand specified"}
            </p>
            <p className="text-sm text-slate-800 truncate" title={item.title}>
              {item.title}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
