import React from "react";
import Token from "../ui/Token";

const OfferPriceDisplay = ({ amount, originalValue, size = "lg" }) => {
  const amountClass = size === "lg" ? "text-lg" : "text-xl";
  const originalValueClass = size === "lg" ? "text-sm" : "text-md";

  return (
    <div className="flex items-baseline justify-center gap-2">
      <p className={`font-bold text-gray-800 ${amountClass}`}>
        {amount} <Token />
      </p>
      <p className={`text-gray-400 line-through ${originalValueClass}`}>
        {originalValue} <Token />
      </p>
    </div>
  );
};

export default OfferPriceDisplay;
