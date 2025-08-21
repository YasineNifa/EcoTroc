import { useEffect, useState } from "react";
import AskAIModal from "../../components/geminiPowered/AskAI";
import ListingImageGallery from "../../components/Product/ListingImageGallery";
import ListingInfoPanel from "../../components/Product/ListingInfoPanel";
import MoreFromSeller from "../../components/Product/MoreFromSeller";
import useRequestResource from "../../hooks/useRequestResource";
import { useParams } from "react-router-dom";
import MakeOfferModal from "../../components/Product/MakeOfferModal";
import ListingInfoPanelSkeleton from "../../components/Product/ListingInfotPanelSkeleton";

const ListingDetailPage = () => {
  const [isAiModalOpen, setAiModalOpen] = useState(false);
  const [isOfferModalOpen, setOfferModalOpen] = useState(false);

  const { id } = useParams();
  const { resource, getResource, isLoading } = useRequestResource({
    endpoint: "listings",
    resourceLabel: "Listing",
  });

  useEffect(() => {
    getResource(id);
  }, [getResource, id]);

  return (
    <div className="">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row w-auto">
          <ListingImageGallery
            imageUrl={resource?.image}
            title={resource?.title}
          />
          {isLoading ? (
            <ListingInfoPanelSkeleton />
          ) : (
            <ListingInfoPanel
              listing={resource}
              onMakeOffer={() => setOfferModalOpen(true)}
              onAskAI={() => setAiModalOpen(true)}
            />
          )}
        </div>
        {/* <MoreFromSeller
          items={resource?.otherItems}
          sellerUsername={resource?.seller.username}
          currentListing={resource}
        /> */}
      </div>
      <AskAIModal
        isOpen={isAiModalOpen}
        onClose={() => setAiModalOpen(false)}
        listing={resource}
      />
      <MakeOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setOfferModalOpen(false)}
        item={resource}
      />
    </div>
  );
};

export default ListingDetailPage;
