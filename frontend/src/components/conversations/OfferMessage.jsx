import React from "react";
import BlockThreeButtons from "../propositions/BlockThreeButtons";
import OfferStatusBadge from "./OfferStatusBadge";
import OfferPriceDisplay from "./OfferPriceDisplay";
import { usePropositionPolling } from "../../hooks/usePropositionPolling";

const OfferMessage = ({ offer, onAccept, onRefuse, onCounterOffer }) => {
  const currentOffer = usePropositionPolling(offer);
  const { proposition } = currentOffer;
  const { status_display, amount, listing } = proposition;

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-md text-center max-w-xs shadow-sm">
      <OfferPriceDisplay
        amount={amount}
        originalValue={listing?.token_value}
        size="xl"
      />

      {status_display === "Pending" ? (
        <BlockThreeButtons
          onPrimary={onAccept}
          onSecondary={onRefuse}
          onThird={onCounterOffer}
          primaryText="Accept"
          secondaryText="Refuse"
          thirdText="Counter offer"
        />
      ) : (
        <OfferStatusBadge status={status_display} />
      )}
    </div>
  );
};

export default OfferMessage;
