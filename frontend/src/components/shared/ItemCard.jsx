import { useContext, useState } from "react";
import Icon from "../ui/Icon";
import Token from "../ui/Token";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AuthContext } from "../../context/AuthContextProvider";
import useRequestResource from "../../hooks/useRequestResource";
import FavoriteIcon from "@mui/icons-material/Favorite";

const ItemCard = ({ item, onGetRecipe }) => {
  const [isLiked, setIsLiked] = useState(item.is_liked);
  const [likesCount, setLikesCount] = useState(item.number_of_likes);
  const { toggleLike } = useRequestResource({ endpoint: "listings" });

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    toggleLike(item.id, (dataFromServer) => {
      setIsLiked(dataFromServer.liked);
      setLikesCount(dataFromServer.likes_count);
    });
  };
  const { profile } = useContext(AuthContext);
  const isOwner = profile?.id === item.owner.id;
  const isAvailable = item.status === "available";

  return (
    <div className="bg-white rounded-lg overflow-hidden group shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          alt={item.title}
          className="w-full h-82 object-cover cursor-pointer"
          src={item.image}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/300x400/cccccc/4A5568?text=Image+Indisponible";
          }}
        />

        {!isAvailable && (
          <div className="absolute bottom-0 left-0 w-full bg-green-600 py-1 text-center z-10">
            <span className="text-white text-xs font-bold uppercase tracking-widest">
              {item.status === "completed" ? "Sold" : "Reserved"}
            </span>
          </div>
        )}

        {item.number_of_likes !== undefined && isAvailable && (
          <div className="absolute bottom-2 right-2 bg-white bg-opacity-50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            {!isOwner ? (
              <button
                onClick={handleLikeClick}
                className="bg-white bg-opacity-40 text-black p-1.5 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-opacity-60 transition-colors"
                aria-label="Toggle like"
              >
                <Icon
                  className={`!text-base transition-colors ${
                    isLiked ? "text-red-500" : ""
                  }`}
                >
                  {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}

                  <span className="ml-1 text-xs">{likesCount}</span>
                </Icon>
              </button>
            ) : (
              <Icon className="!text-base transition-colors text-red-500">
                {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}

                <span className="ml-1 text-xs">{likesCount}</span>
              </Icon>
            )}
          </div>
        )}
      </div>
      <div className="p-3">
        <h1 className="text-lg font-semibold mb-1">{item.title}</h1>
        <p className="text-xs text-gray-500">{item.brand}</p>
        <p className="text-sm text-gray-800">{item.condition_display}</p>
        <p className="font-bold text-lg text-teal-600 flex items-center">
          {item.token_value} <Token />
        </p>
        {item.category === "Maison" && (
          <button
            onClick={() => onGetRecipe(item.title)}
            className="text-xs text-teal-600 font-semibold mt-2 hover:underline"
          >
            ✨ Obtenir une idée recette
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
