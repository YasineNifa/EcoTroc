import { useEffect, useState } from "react";
import AskAIModal from "../../components/geminiPowered/AskAI";
import ListingImageGallery from "../../components/Product/ListingImageGallery";
import ListingInfoPanel from "../../components/Product/ListingInfoPanel";
import MoreFromSeller from "../../components/Product/MoreFromSeller";
import useRequestResource from "../../hooks/useRequestResource";
import { useParams } from "react-router-dom";

const ListingDetailPage = () => {
  const [isAiModalOpen, setAiModalOpen] = useState(false);
  const { id } = useParams();
  const { resource, getResource } = useRequestResource({
    endpoint: "listings",
    resourceLabel: "Listing",
  });

  useEffect(() => {
    getResource(id);
  }, [getResource, id]);

  console.log("Listing : ", resource);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row">
          <ListingImageGallery
            imageUrl={resource?.image}
            title={resource?.title}
          />
          <ListingInfoPanel
            listing={resource}
            onAskAI={() => setAiModalOpen(true)}
          />
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
    </div>
  );
};

export default ListingDetailPage;
