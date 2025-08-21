import { useContext, useEffect, useState } from "react";
import ProfileHeader from "../../components/header/ProfileHeader";
import ReviewsTab from "../../components/header/ReviewTab";
import ListingsTab from "../../components/header/ListingTab";
import StatsTab from "../../components/header/StatsTab";
import useRequestResource from "../../hooks/useRequestResource";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextProvider";
import TabButton from "../../components/ui/TabButton";

const ProfilePage = () => {
  const { profile, user } = useContext(AuthContext);
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("listings");
  const { resourceList, getResourceList } = useRequestResource({
    endpoint: "listings",
    resourceLabel: "Listings",
  });

  const { resource, getResource } = useRequestResource({
    endpoint: "profiles",
    resourceLabel: "Profiles",
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

  useEffect(() => {
    if (id) {
      getResource(id);
      getResourceList({ query: "?owner=" + id });
      getReviews();
    }
  }, [id, getResource, getResourceList, getReviews]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader
        profile={resource}
        navigaterProfile={profile}
        navigaterUser={user}
      />
      <div className="flex items-center border-b mb-6">
        <TabButton
          tabName="listings"
          label="Listings"
          activeTab={activeTab}
          setActiveTab={() => setActiveTab("listings")}
        />
        <TabButton
          tabName="reviews"
          label="Reviews"
          activeTab={activeTab}
          setActiveTab={() => setActiveTab("reviews")}
        />
        <TabButton
          tabName="statistics"
          label="Statistics"
          activeTab={activeTab}
          setActiveTab={() => setActiveTab("statistics")}
        />
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default ProfilePage;
