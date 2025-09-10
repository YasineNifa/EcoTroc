import React from "react";
import { usePropositionPolling } from "../../hooks/usePropositionPolling";
import OfferPriceDisplay from "./OfferPriceDisplay";
import OfferStatusBadge from "./OfferStatusBadge";

const SentOfferMessage = ({ offer }) => {
  const currentOffer = usePropositionPolling(offer);
  const { proposition } = currentOffer;
  const { status_display, amount, listing } = proposition;

  return (
    <div className="p-3 bg-gray-100 rounded-lg text-center border border-gray-200">
      <OfferPriceDisplay
        amount={amount}
        originalValue={listing?.token_value}
        size="lg"
      />
      <OfferStatusBadge status={status_display} />
    </div>
  );
};

export default SentOfferMessage;
