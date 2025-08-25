// src/components/messages/SentOfferMessage.jsx

import React from "react";
import Token from "../ui/Token";

const SentOfferMessage = ({ offer }) => (
  <div className="p-3 bg-gray-100 rounded-lg text-center border border-gray-200">
    <div className="flex items-baseline justify-center gap-2">
      <p className="text-lg font-bold text-gray-800">
        {offer?.proposition?.amount} <Token />
      </p>
      <p className="text-sm text-gray-400 line-through">
        {offer?.proposition?.listing?.token_value} <Token />
      </p>
    </div>
    <p className="text-sm font-semibold text-yellow-600 mt-1">Pending</p>
  </div>
);

export default SentOfferMessage;
