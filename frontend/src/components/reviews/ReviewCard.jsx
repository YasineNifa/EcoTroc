import React from "react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import TimeAgo from "../conversations/TimeAgo";

const ReviewCard = ({ review }) => {
  const reviewer = review.reviewer;

  return (
    <div className="p-4 border-b border-gray-200 last:border-b-0">
      <div className="flex items-start gap-4">
        <Link to={`/profile/${reviewer.user.username}`}>
          <img
            src={
              reviewer.image ||
              `https://i.pravatar.cc/48?u=${reviewer.user.username}`
            }
            alt="Reviewer Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Link to={`/profile/${reviewer.user.username}`}>
              <p className="font-bold text-gray-800 hover:underline">
                {reviewer.user.username}
              </p>
            </Link>
            <TimeAgo
              date={review.created_at}
              className="text-xs text-gray-500"
            />
          </div>
          <div className="my-1">
            <StarRating rating={review.rating} />
          </div>
          <p className="text-sm text-gray-700">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
