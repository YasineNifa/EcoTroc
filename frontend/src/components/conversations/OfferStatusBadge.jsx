import React from "react";

const OfferStatusBadge = ({ status }) => {
  const statusClassMap = {
    Rejected: "text-red-600",
    Pending: "text-yellow-600",
  };

  const statusClass = statusClassMap[status] || "text-green-600";

  return (
    <p className={`text-sm font-semibold mt-1 ${statusClass}`}>
      {status}
    </p>
  );
};

export default OfferStatusBadge;
