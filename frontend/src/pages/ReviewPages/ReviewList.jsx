import React from "react";
import ReviewCard from "../../components/reviews/ReviewCard";

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500 bg-white rounded-lg shadow-sm border">
        This user has no reviews yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
