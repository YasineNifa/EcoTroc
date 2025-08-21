import getCommonOptions from "../../helpers/axios/getCommonOptions";
import TimeAgo from "../conversations/TimeAgo";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Token from "../ui/Token";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import BlockThreeButtons from "../propositions/BlockThreeButtons";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BuyerProtectionPolicy from "./BuyerProtectionPolicy";
import BuyerInfo from "./BuyerInfos";
import { useSnackbar } from "notistack";
import apiClient from "../../services/api";

const ListingInfoPanel = ({ listing, onAskAI, onMakeOffer, finalPrice }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const details = [
    { label: "Marque", value: listing?.brand },
    { label: "Size", value: listing?.size },
    { label: "State", value: listing?.condition_display },
    { label: "Color", value: listing?.color },
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

  const handleBuyClick = async () => {
    try {
      const response = await apiClient.post(
        `/listings/${listing.id}/reserve/`,
        getCommonOptions()
      );
      enqueueSnackbar(response.data.detail, { variant: "success" });
      // Redirect to the transactions page so the user can see the new pending transaction
      navigate("/transactions");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to buy the item.";
      enqueueSnackbar(errorMsg, { variant: "error" });
    }
  };

  if (!user) return null;
  return (
    <div className="w-full lg:w-3/12 border border-gray-200 rounded-md p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{listing?.title}</h1>
        <div className="flex justify-between text-sm mb-2">
          <TimeAgo date={listing?.created_at} />
        </div>
      </div>
      {finalPrice ? (
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-bold">
            {finalPrice}
            <Token />
          </p>
          <p className="text-md text-gray-400 line-through">
            {listing?.token_value} <Token />
          </p>
        </div>
      ) : (
        <p className="text-lg text-gray-800">
          {listing?.token_value}
          <Token />
        </p>
      )}
      <span className="mr-1 text-gray-500">
        {listing?.views || 0}
        <Icon className="text-teal-600 ml-1">
          <VisibilityIcon />
        </Icon>
      </span>
      |
      <span className="ml-1 text-gray-500">
        {listing?.number_of_likes}
        <Icon className="text-teal-600 ml-1">
          <FavoriteIcon />
        </Icon>
      </span>
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
      {user?.username !== listing?.owner?.user?.username ? (
        <BlockThreeButtons
          onPrimary={handleBuyClick}
          onSecondary={onMakeOffer}
          onThird={handleMessageClick}
          primaryText="Buy"
          secondaryText="Make an offre"
          thirdText="Message"
        />
      ) : (
        <BlockThreeButtons
          onPrimary={() => {}}
          onSecondary={() => {}}
          onThird={() => {}}
          primaryText="Edit"
          secondaryText="Delete"
          thirdText="Mark as Unavailable"
        />
      )}
      <div className="mt-6 p-4 bg-gray-50 rounded-md text-sm">
        <BuyerProtectionPolicy />
      </div>
      <div className="mt-6">
        <BuyerInfo profile={listing?.owner} />
      </div>
    </div>
  );
};

export default ListingInfoPanel;
