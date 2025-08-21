import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getCommonOptions from "../../helpers/axios/getCommonOptions";
import Token from "../ui/Token";

// --- "Make an Offer" Modal ---
const MakeOfferModal = ({ isOpen, onClose, item }) => {
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [customPrice, setCustomPrice] = useState("");

  const suggestedOffers = [
    { reduction: "10%", token_value: Math.round(item?.token_value * 0.9) },
    { reduction: "22%", token_value: Math.round(item?.token_value * 0.78) },
  ];

  const handleSelectOffer = (token_value) => {
    setSelectedOffer(token_value);
    setCustomPrice("");
  };

  const handleSelectCustom = () => {
    setSelectedOffer("custom");
  };

  const handlePropose = async (e) => {
    e.preventDefault();
    const offerPrice = selectedOffer === "custom" ? customPrice : selectedOffer;
    if (offerPrice) {
      const values = {
        offer_amount: Number(offerPrice),
      };
      onClose();
      const response = await axios.post(
        `http://localhost:8000/api/listings/${item.id}/make_offer/`,
        values,
        getCommonOptions()
      );
      const data = response.data;
      if (data.conversation_id) {
        onClose();
        navigate(`/messages/${data.conversation_id}`);
      }
    } else {
      alert("Please select or enter an offer.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Faire une offre">
      <div className="flex items-center gap-4 border-b pb-4">
        <img
          src={item?.image}
          alt={item?.title}
          className="w-16 h-16 rounded-md"
        />
        <div>
          <p className="font-semibold">{item?.title}</p>
          <p className="text-sm text-gray-500">
            Prix de l'article: {item?.token_value} Tokens
          </p>
        </div>
      </div>
      <div className="flex justify-around my-4">
        {suggestedOffers.map((offer) => (
          <button
            key={offer.reduction}
            onClick={() => handleSelectOffer(offer?.token_value)}
            className={`p-4 border rounded-md text-center ${
              selectedOffer === offer?.token_value
                ? "border-teal-500 ring-2 ring-teal-500"
                : "hover:border-gray-400"
            }`}
          >
            <p className="font-bold">
              {offer?.token_value}
              <Token />
            </p>
            <p className="text-xs text-green-600">
              {offer?.reduction} de réduction
            </p>
          </button>
        ))}
        <button
          onClick={handleSelectCustom}
          className={`p-4 border rounded-md text-center ${
            selectedOffer === "custom"
              ? "border-teal-500 ring-2 ring-teal-500"
              : "hover:border-gray-400"
          }`}
        >
          <p className="font-bold">Autre</p>
          <p className="text-xs text-gray-500">Proposer un prix</p>
        </button>
      </div>
      {selectedOffer === "custom" && (
        <div className="my-4">
          <input
            type="number"
            value={customPrice}
            onChange={(e) => setCustomPrice(e.target.value)}
            placeholder="Votre prix"
            className="w-full p-2 border rounded-md"
          />
        </div>
      )}
      <Button onClick={handlePropose} variant="primary" className="w-full mt-4">
        Propose
      </Button>
    </Modal>
  );
};

export default MakeOfferModal;
