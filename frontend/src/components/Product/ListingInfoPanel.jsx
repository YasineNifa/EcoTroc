// import getCommonOptions from "../../helpers/axios/getCommonOptions";
// import TimeAgo from "../conversations/TimeAgo";
// import Button from "../ui/Button";
// import Icon from "../ui/Icon";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Token from "../ui/Token";
// import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContextProvider";
// import BlockThreeButtons from "../propositions/BlockThreeButtons";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import BuyerProtectionPolicy from "./BuyerProtectionPolicy";
// import BuyerInfo from "./BuyerInfos";
// import { useSnackbar } from "notistack";
// import apiClient from "../../services/api";

// const ListingInfoPanel = ({ listing, onAskAI, onMakeOffer, finalPrice }) => {
//   const { enqueueSnackbar } = useSnackbar();
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
//   const details = [
//     { label: "Marque", value: listing?.brand },
//     { label: "Size", value: listing?.size },
//     { label: "State", value: listing?.condition_display },
//     { label: "Color", value: listing?.color },
//   ];

//   const handleMessageClick = async (e) => {
//     e.preventDefault();
//     const response = await axios.post(
//       `http://localhost:8000/api/listings/${listing.id}/contact_seller/`,
//       {},
//       getCommonOptions()
//     );
//     const data = response.data;
//     navigate(`/messages/${data.conversation.id}`);
//   };

//   const handleBuyClick = async () => {
//     try {
//       const response = await apiClient.post(
//         `/listings/${listing.id}/reserve/`,
//         getCommonOptions()
//       );
//       enqueueSnackbar(response.data.detail, { variant: "success" });
//       // Redirect to the transactions page so the user can see the new pending transaction
//       navigate("/transactions");
//     } catch (err) {
//       const errorMsg = err.response?.data?.detail || "Failed to buy the item.";
//       enqueueSnackbar(errorMsg, { variant: "error" });
//     }
//   };

//   const handleEdit = () => {
//     navigate(`/listings/${listing.id}/edit`);
//   };

//   if (!user) return null;
//   return (
//     <div className="w-full lg:w-3/12 border border-gray-200 rounded-md p-4 shadow-sm">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">{listing?.title}</h1>
//         <div className="flex justify-between text-sm mb-2">
//           <TimeAgo date={listing?.created_at} />
//         </div>
//       </div>
//       {finalPrice ? (
//         <div className="flex items-baseline gap-2">
//           <p className="text-xl font-bold">
//             {finalPrice}
//             <Token />
//           </p>
//           <p className="text-md text-gray-400 line-through">
//             {listing?.token_value} <Token />
//           </p>
//         </div>
//       ) : (
//         <p className="text-lg text-gray-800">
//           {listing?.token_value}
//           <Token />
//         </p>
//       )}
//       <span className="mr-1 text-gray-500">
//         {listing?.views || 0}
//         <Icon className="text-teal-600 ml-1">
//           <VisibilityIcon />
//         </Icon>
//       </span>
//       |
//       <span className="ml-1 text-gray-500">
//         {listing?.number_of_likes}
//         <Icon className="text-teal-600 ml-1">
//           <FavoriteIcon />
//         </Icon>
//       </span>
//       <hr className="my-4" />
//       {details.map((detail) => (
//         <div key={detail.label} className="flex justify-between text-sm mb-2">
//           <span className="text-gray-500">{detail.label}</span>
//           <span className="text-gray-800 font-semibold">{detail.value}</span>
//         </div>
//       ))}
//       <hr className="my-4" />
//       <p className="text-sm text-gray-800 mb-4">{listing?.description}</p>
//       <Button
//         onClick={onAskAI}
//         variant="secondary"
//         className="!w-auto !text-xs !py-1 !px-2"
//       >
//         ✨ Ask AI a question about this item
//       </Button>
//       {user?.username !== listing?.owner?.user?.username ? (
//         listing?.status === "available" ? (
//           <BlockThreeButtons
//             onPrimary={handleBuyClick}
//             onSecondary={onMakeOffer}
//             onThird={handleMessageClick}
//             primaryText="Buy"
//             secondaryText="Make an offre"
//             thirdText="Message"
//           />
//         ) : (
//           <></>
//         )
//       ) : (
//         <BlockThreeButtons
//           onPrimary={handleEdit}
//           onSecondary={() => {}}
//           onThird={() => {}}
//           primaryText="Edit"
//           secondaryText="Delete"
//           thirdText="Mark as Unavailable"
//         />
//       )}
//       <div className="mt-6 p-4 bg-gray-50 rounded-md text-sm">
//         <BuyerProtectionPolicy />
//       </div>
//       <div className="mt-6">
//         <BuyerInfo profile={listing?.owner} />
//       </div>
//     </div>
//   );
// };

// export default ListingInfoPanel;

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { AuthContext } from "../../context/AuthContextProvider";
import apiClient from "../../services/api";

// UI Components
import TimeAgo from "../conversations/TimeAgo";
import Token from "../ui/Token";
import BlockThreeButtons from "../propositions/BlockThreeButtons";
import BuyerProtectionPolicy from "./BuyerProtectionPolicy";
import BuyerInfo from "./BuyerInfos";

// Icons
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import getCommonOptions from "../../helpers/axios/getCommonOptions";

// --- Sub-component for Price and Stats ---
const ListingHeader = ({ listing, finalPrice }) => (
  <>
    <div className="flex justify-between items-start gap-4">
      <h1 className="text-2xl font-bold text-slate-900">{listing?.title}</h1>
      <div className="text-sm text-slate-500 flex-shrink-0 pt-1">
        <TimeAgo date={listing?.created_at} />
      </div>
    </div>

    <div className="mt-2">
      {finalPrice ? (
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-slate-800 flex items-center">
            {finalPrice} <Token />
          </p>
          <p className="text-lg text-slate-400 line-through flex items-center">
            {listing?.token_value} <Token />
          </p>
        </div>
      ) : (
        <p className="text-2xl font-bold text-slate-800 flex items-center">
          {listing?.token_value} <Token />
        </p>
      )}
    </div>

    <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
      <div className="flex items-center gap-1.5">
        <VisibilityIcon sx={{ fontSize: 18 }} className="text-slate-400" />
        <span>{listing?.views || 0} views</span>
      </div>
      <div className="flex items-center gap-1.5">
        <FavoriteIcon sx={{ fontSize: 18 }} className="text-slate-400" />
        <span>{listing?.number_of_likes || 0} likes</span>
      </div>
    </div>
  </>
);

// --- Sub-component for the Details Grid ---
const DetailsGrid = ({ listing }) => {
  const details = [
    { label: "Brand", value: listing?.brand },
    { label: "Size", value: listing?.size },
    { label: "Condition", value: listing?.condition_display },
    { label: "Color", value: listing?.color },
  ];

  return (
    <div className="space-y-3">
      {details.map(
        (detail) =>
          detail.value && (
            <div key={detail.label} className="grid grid-cols-3 gap-4 text-sm">
              <span className="text-slate-500 col-span-1">{detail.label}</span>
              <span className="text-slate-800 font-medium col-span-2">
                {detail.value}
              </span>
            </div>
          )
      )}
    </div>
  );
};

// --- Main Component ---
const ListingInfoPanel = ({ listing, onAskAI, onMakeOffer, finalPrice }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (!listing || !user) return null; // Guard against missing data

  const isOwner = user?.id === listing?.owner?.id;

  // --- API Handlers ---
  const handleMessageClick = async () => {
    try {
      const response = await apiClient.post(
        `/listings/${listing.id}/contact_seller/`,
        getCommonOptions()
      );
      navigate(`/messages/${response.data.conversation.id}`);
    } catch (err) {
      enqueueSnackbar("Could not start a conversation.", { variant: "error" });
    }
  };

  const handleBuyClick = async () => {
    try {
      await apiClient.post(
        `/listings/${listing.id}/reserve/`,
        getCommonOptions()
      );
      enqueueSnackbar("Item reserved successfully!", { variant: "success" });
      navigate("/transactions");
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || "Failed to reserve the item.";
      enqueueSnackbar(errorMsg, { variant: "error" });
    }
  };

  const handleEdit = () => navigate(`/listings/${listing.id}/edit`);

  return (
    // The parent grid now controls the width. This component just fills the space.
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col gap-6">
      <ListingHeader listing={listing} finalPrice={finalPrice} />

      <div className="border-t border-slate-200"></div>

      <DetailsGrid listing={listing} />

      <div className="border-t border-slate-200"></div>

      <div>
        <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
        <p className="text-sm text-slate-600 whitespace-pre-line">
          {listing?.description}
        </p>
        <button
          onClick={onAskAI}
          className="mt-4 text-xs font-semibold text-teal-600 hover:text-teal-700"
        >
          ✨ Ask AI a question about this item
        </button>
      </div>

      <div>
        {isOwner ? (
          <BlockThreeButtons
            onPrimary={handleEdit}
            primaryText="Edit Listing"
            // Add functions for delete/mark unavailable
          />
        ) : listing?.status === "available" ? (
          <BlockThreeButtons
            onPrimary={handleBuyClick}
            onSecondary={onMakeOffer}
            onThird={handleMessageClick}
            primaryText="Buy Now"
            secondaryText="Make an offer"
            thirdText="Message Seller"
          />
        ) : (
          <div className="text-center font-bold text-slate-700 bg-slate-100 p-3 rounded-md">
            This item is no longer available
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 rounded-md">
        <BuyerProtectionPolicy />
      </div>

      <div>
        <BuyerInfo profile={listing?.owner} />
      </div>
    </div>
  );
};

export default ListingInfoPanel;
