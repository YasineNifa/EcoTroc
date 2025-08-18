import { useEffect, useState } from "react";
import ProfileHeader from "../../components/header/ProfileHeader";
import ReviewsTab from "../../components/header/ReviewTab";
import ListingsTab from "../../components/header/ListingTab";
import StatsTab from "../../components/header/StatsTab";
import useRequestResource from "../../hooks/useRequestResource";

// const mockListings = [
//   {
//     id: 1,
//     imageUrl: "https://placehold.co/300x400/333/FFF?text=Item+1",
//     status: "active",
//   },
//   {
//     id: 2,
//     imageUrl: "https://placehold.co/300x400/444/FFF?text=Item+2",
//     status: "active",
//   },
//   {
//     id: 3,
//     imageUrl: "https://placehold.co/300x400/555/FFF?text=Item+3",
//     status: "sold",
//   },
// ];
// const mockReviews = [
//   {
//     id: 1,
//     author: "blijkerkerken",
//     avatarUrl: "https://placehold.co/40x40/D1FAE5/10B981?text=B",
//     rating: 5,
//     comment: "Dank je wel (Thank you)",
//     date: "3 months ago",
//   },
//   {
//     id: 2,
//     author: "sebolo94",
//     avatarUrl: "https://placehold.co/40x40/E0E7FF/4F46E5?text=S",
//     rating: 5,
//     comment:
//       "Vendeur sérieux et sympathique. Envoi rapide et soigné. (Serious and friendly seller. Fast and neat shipping.)",
//     date: "3 months ago",
//   },
// ];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("listings");
  const { resourceList, getResourceList } = useRequestResource({
    endpoint: "listings",
    resourceLabel: "Listing",
  });

  const { resourceList: reviews, getResourceList: getReviews } =
    useRequestResource({
      endpoint: "reviews",
      resourceLabel: "Review",
    });

  const renderTabContent = () => {
    switch (activeTab) {
      case "listings":
        return <ListingsTab listings={resourceList.results} />;
      case "reviews":
        return <ReviewsTab reviews={reviews.results} />;
      case "statistics":
        return <StatsTab />;
      default:
        return <ListingsTab listings={resourceList.results} />;
    }
  };
  const TabButton = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-semibold ${
        activeTab === tabName
          ? "border-b-2 border-teal-600 text-teal-600"
          : "text-gray-500"
      }`}
    >
      {" "}
      {label}{" "}
    </button>
  );

  useEffect(() => {
    getResourceList();
    getReviews();
  }, [getResourceList, getReviews]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader />
      <div className="flex items-center border-b mb-6">
        <TabButton tabName="listings" label="Listings" />
        <TabButton tabName="reviews" label="Reviews" />
        <TabButton tabName="statistics" label="Statistics" />
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default ProfilePage;
