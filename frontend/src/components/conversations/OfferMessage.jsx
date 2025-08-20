import Button from "../ui/Button";

const OfferMessage = ({
  offer,
  originalPrice,
  onAccept,
  onRefuse,
  onCounterOffer,
}) => (
  <div className="flex items-end gap-2 mb-4 justify-start">
    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-green-500 flex items-center justify-center text-white font-bold text-sm">
      {offer.sender.charAt(0).toUpperCase()}
    </div>
    <div className="p-4 bg-white border border-gray-200 rounded-md text-center max-w-xs shadow-sm">
      <div className="flex items-baseline justify-center gap-2">
        <p className="text-xl font-bold">{offer.price.toFixed(2)} €</p>
        <p className="text-md text-gray-400 line-through">
          {originalPrice.toFixed(2)} €
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
          <Button
            onClick={onCounterOffer}
            variant="secondary"
            className="flex-1"
          >
            Faire une offre
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default OfferMessage;
