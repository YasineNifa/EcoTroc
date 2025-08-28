import { useContext, useEffect, useMemo, useState } from "react";
import ProfileHeader from "../../components/header/ProfileHeader";
import ReviewsTab from "../../components/header/ReviewTab";
import ListingsTab from "../../components/header/ListingTab";
import StatsTab from "../../components/header/StatsTab";
import useRequestResource from "../../hooks/useRequestResource";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextProvider";
import TabButton from "../../components/ui/TabButton";
import ReviewList from "../ReviewPages/ReviewList";

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
        // return <ReviewsTab reviews={reviews.results} />;
        return <ReviewList reviews={reviews.results} />;
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
      getReviews({ query: `?reviewed_profile=${id}` });
    }
  }, [id, getResource, getResourceList, getReviews]);

  const { averageRating, reviewCount } = useMemo(() => {
    const reviewsData = reviews.results || [];
    if (reviewsData.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }
    const totalRating = reviewsData.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return {
      averageRating: totalRating / reviewsData.length,
      reviewCount: reviewsData.length,
    };
  }, [reviews]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader
        profile={resource}
        navigaterProfile={profile}
        navigaterUser={user}
        averageRating={averageRating}
        reviewCount={reviewCount}
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
