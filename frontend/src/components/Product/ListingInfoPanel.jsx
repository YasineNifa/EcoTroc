import getCommonOptions from "../../helpers/axios/getCommonOptions";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListingInfoPanel = ({ listing, onAskAI, onMakeOffer }) => {
  const navigate = useNavigate();
  const details = [
    { label: "Marque", value: listing?.brand },
    { label: "Taille", value: listing?.size },
    { label: "État", value: listing?.condition },
    { label: "Couleur", value: listing?.color },
    { label: "Ajouté", value: listing?.uploadedAgo },
  ];

  const handleMessageClick = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `http://localhost:8000/api/listings/${listing.id}/contact_seller/`,
      {},
      getCommonOptions()
    );
    const data = response.data;
    navigate(`/messages/${data.conversation.id}`);
  };
  return (
    <div className="w-full lg:w-5/12 lg:pl-10">
      <div className="text-sm text-gray-500 mb-4">
        <span>{listing?.views} vues</span> |
        <span>{listing?.number_of_likes} favoris</span>
      </div>
      <h1 className="text-2xl font-bold">{listing?.title}</h1>
      <p className="text-lg text-gray-800 my-2">
        {listing?.token_value.toFixed(2)} Token
      </p>
      <hr className="my-4" />
      {details.map((detail) => (
        <div key={detail.label} className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">{detail.label}</span>
          <span className="text-gray-800 font-semibold">{detail.value}</span>
        </div>
      ))}
      <hr className="my-4" />
      <p className="text-sm text-gray-800 mb-4">{listing?.description}</p>
      <Button
        onClick={onAskAI}
        variant="secondary"
        className="!w-auto !text-xs !py-1 !px-2"
      >
        ✨ Ask AI a question about this item
      </Button>
      <div className="space-y-3 mt-6">
        <Button variant="primary">Buy</Button>
        <Button variant="secondary" onClick={onMakeOffer}>
          Make an offer
        </Button>
        <Button variant="secondary" onClick={handleMessageClick}>
          Message
        </Button>
      </div>
      <div className="mt-6 p-4 bg-gray-50 rounded-md text-sm">
        <div className="flex items-start gap-3">
          <Icon className="text-teal-600">shield</Icon>
          <div>
            <h3 className="font-bold">Frais de Protection acheteurs</h3>
            <p className="text-xs text-gray-600 mt-1">
              Pour tout achat effectué par le biais du bouton "Acheter", des
              frais de service seront ajoutés.
              <a href="#" className="text-teal-600 font-semibold ml-1">
                Politique de Protection acheteurs
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center cursor-pointer p-2 -ml-2 rounded-md hover:bg-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={listing?.owner.image}
              alt={listing?.owner.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-bold text-sm">{listing?.owner.username}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Icon className="!text-sm text-yellow-500">star</Icon>
                <span className="ml-1">
                  {listing?.owner.rating} ({listing?.owner.reviewsCount} avis)
                </span>
              </div>
            </div>
          </div>
          <Icon>
            <ChevronRightIcon />
          </Icon>
        </div>
      </div>
    </div>
  );
};

export default ListingInfoPanel;
