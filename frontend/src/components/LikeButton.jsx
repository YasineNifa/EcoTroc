import { useState } from "react";
import useRequestResource from "../hooks/useRequestResource";

// Using Material UI Icons as you were
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// The Like Button is complex enough to be its own component
const LikeButton = ({ item, isOwner }) => {
  const [isLiked, setIsLiked] = useState(item.is_liked);
  const [likesCount, setLikesCount] = useState(item.number_of_likes);
  const { toggleLike } = useRequestResource({ endpoint: "listings" });

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    // Call API and update with server state
    toggleLike(item.id, (dataFromServer) => {
      setIsLiked(dataFromServer.liked);
      setLikesCount(dataFromServer.likes_count);
    });
  };

  if (isOwner) {
    return (
      <div className="flex items-center gap-1 text-slate-700">
        <FavoriteBorderIcon fontSize="small" className="" />
        {/* text-red-500 */}
        <span className="text-sm font-medium">{likesCount}</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleLikeClick}
      className="flex items-center gap-1.5 text-slate-600 hover:text-red-500 transition-colors"
      aria-label="Toggle like"
    >
      {isLiked ? (
        <FavoriteIcon fontSize="small" className="text-red-500" />
      ) : (
        <FavoriteBorderIcon fontSize="small" />
      )}
      <span className="text-sm font-medium">{likesCount}</span>
    </button>
  );
};

export default LikeButton;
