import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const StarRating = ({ rating, className = "" }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);

  return (
    <div className={`flex items-center text-yellow-500 ${className}`}>
      {[...Array(totalStars)].map((_, index) => {
        return index < fullStars ? (
          <StarIcon key={index} fontSize="small" />
        ) : (
          <StarBorderIcon key={index} fontSize="small" />
        );
      })}
    </div>
  );
};

export default StarRating;
