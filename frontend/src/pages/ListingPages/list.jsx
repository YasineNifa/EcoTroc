import { useEffect, useState } from "react";
import ItemCard from "../../components/shared/ItemCard";
import NotificationBanner from "../../components/shared/NotificationBanner";
import useRequestResource from "../../hooks/useRequestResource";
import ListListings from "../../components/ListListings";
import ListingsPage from "../../components/ListingPage";

function Listings() {
  //   const [isSellModalOpen, setSellModalOpen] = useState(false);
  //   const [isRecipeModalOpen, setRecipeModalOpen] = useState(false);
  //   const [selectedItemTitle, setSelectedItemTitle] = useState("");
  const { getResourceList, resourceList } = useRequestResource({
    endpoint: "listings",
    resourceLabel: "Listing",
  });

  //   const handleGetRecipe = (itemTitle) => {
  //     setSelectedItemTitle(itemTitle);
  //     setRecipeModalOpen(true);
  //   };

  useEffect(() => {
    getResourceList({ query: "?status=available" });
  }, [getResourceList]);
  return (
    <>
      <NotificationBanner />
      {/* <ListListings results={resourceList.results} /> */}
      <ListingsPage />
    </>
  );
}

export default Listings;

{
  /* <SellItemModal
isOpen={isSellModalOpen}
onClose={() => setSellModalOpen(false)}
/>
<RecipeModal
isOpen={isRecipeModalOpen}
onClose={() => setRecipeModalOpen(false)}
itemTitle={selectedItemTitle}
/> */
}

{
  /* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {resourceList.results.map((item) => (
          <ItemCard key={item.id} item={item} />
          //   onGetRecipe={handleGetRecipe}
        ))}
      </div> */
}
