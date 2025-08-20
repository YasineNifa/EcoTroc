import Button from "../ui/Button";

const OfferMessage = ({ offer, onAccept, onRefuse, onCounterOffer }) => (
  <div className="p-4 bg-white border border-gray-200 rounded-md text-center max-w-xs shadow-sm">
    <div className="flex items-baseline justify-center gap-2">
      <p className="text-xl font-bold">
        {offer?.proposition?.amount.toFixed(2)} tokens
      </p>
      <p className="text-md text-gray-400 line-through">
        {offer?.proposition?.listing?.token_value.toFixed(2)} tokens
      </p>
    </div>
    <div className="flex flex-col gap-2 mt-3">
      <Button onClick={onAccept} variant="primary" className="!py-2.5">
        Accepter l'offre
      </Button>
      <div className="flex gap-2">
        <Button onClick={onRefuse} variant="secondary" className="flex-1">
          Refuser l'offre
        </Button>
        <Button onClick={onCounterOffer} variant="secondary" className="flex-1">
          Faire une offre
        </Button>
      </div>
    </div>
  </div>
);

export default OfferMessage;
