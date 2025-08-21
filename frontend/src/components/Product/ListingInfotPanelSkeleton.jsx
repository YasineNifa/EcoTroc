// You can put this in a new file, e.g., ListingInfoPanelSkeleton.jsx

const ListingInfoPanelSkeleton = () => (
  <div className="w-full lg:w-5/12 lg:pl-10 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-8 bg-gray-300 rounded w-1/2"></div>
    <div className="h-6 bg-gray-300 rounded w-1/4 my-2"></div>
    <hr className="my-4" />
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <hr className="my-4" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="space-y-3 mt-6">
      <div className="h-12 bg-gray-300 rounded-md w-full"></div>
      <div className="h-12 bg-gray-200 rounded-md w-full"></div>
    </div>
  </div>
);

export default ListingInfoPanelSkeleton;
