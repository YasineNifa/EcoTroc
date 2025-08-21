import BlockThreeButtons from "../propositions/BlockThreeButtons";
import Token from "../ui/Token";

const OfferMessage = ({ offer, onAccept, onRefuse, onCounterOffer }) => (
  <div className="p-4 bg-white border border-gray-200 rounded-md text-center max-w-xs shadow-sm">
    <div className="flex items-baseline justify-center gap-2">
      <p className="text-xl font-bold">
        {offer?.proposition?.amount}
        <Token />
      </p>
      <p className="text-md text-gray-400 line-through">
        {offer?.proposition?.listing?.token_value} <Token />
      </p>
    </div>
    <BlockThreeButtons
      onPrimary={onAccept}
      onSecondary={onRefuse}
      onThird={onCounterOffer}
      primaryText="Accept"
      secondaryText="Refuse"
      thirdText="Counter offer"
    />
  </div>
);

export default OfferMessage;
