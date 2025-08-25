import { useEffect, useState } from "react";
import AskAIModal from "../../components/geminiPowered/AskAI";
import ListingImageGallery from "../../components/Product/ListingImageGallery";
import ListingInfoPanel from "../../components/Product/ListingInfoPanel";
import MoreFromSeller from "../../components/Product/MoreFromSeller";
import useRequestResource from "../../hooks/useRequestResource";
import { useParams } from "react-router-dom";
import MakeOfferModal from "../../components/Product/MakeOfferModal";
import ListingInfoPanelSkeleton from "../../components/Product/ListingInfotPanelSkeleton";
import apiClient from "../../services/api";
import getCommonOptions from "../../helpers/axios/getCommonOptions";

const ListingDetailPage = () => {
  const [isAiModalOpen, setAiModalOpen] = useState(false);
  const [isOfferModalOpen, setOfferModalOpen] = useState(false);
  const [finalPrice, setFinalPrice] = useState(null);
  const [pageIsLoading, setPageIsLoading] = useState(true);

  const { id } = useParams();
  const { resource, getResource, isLoading } = useRequestResource({
    endpoint: "listings",
    resourceLabel: "Listing",
  });

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;
      setPageIsLoading(true);
      getResource(id);
      apiClient
        .get(`/listings/${id}/last_accepted_proposition/`, getCommonOptions())
        .then((response) => {
          setFinalPrice(response.data.amount);
        })
        .catch((error) => {
          setFinalPrice(resource?.token_value);
        });

      setPageIsLoading(false);
    };

    fetchAllData();
  }, [id]);

  return (
    <div className="bg-slate-50 min-h-screen py-8 md:py-12">
      <main className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="aspect-square w-full bg-slate-200 rounded-lg animate-pulse" />
            ) : (
              <ListingImageGallery
                imageUrl={resource?.image}
                status={resource?.status}
                title={resource?.title}
              />
            )}
          </div>

          <div className="lg:col-span-2">
            {pageIsLoading ? (
              <ListingInfoPanelSkeleton />
            ) : (
              <ListingInfoPanel
                listing={resource}
                onMakeOffer={() => setOfferModalOpen(true)}
                onAskAI={() => setAiModalOpen(true)}
                finalPrice={finalPrice}
              />
            )}
          </div>
        </div>
        {/* <MoreFromSeller
          items={resource?.otherItems}
          sellerUsername={resource?.seller.username}
          currentListing={resource}
        /> */}
      </main>
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
