const ListingImageGallery = ({ imageUrl, title, status }) => {
  const isAvailable = status === "available";

  return (
    <div className="w-full lg:w-7/12">
      <div className="relative w-full h-[70vh] max-h-[600px] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x600/e2e8f0/4a5568?text=EcoTroc";
          }}
        />

        {!isAvailable && (
          <div className="absolute bottom-0 left-0 w-full bg-slate-800 bg-opacity-80 py-1.5 text-center z-10">
            <span className="text-white text-xs font-bold uppercase tracking-widest">
              {status === "completed" ? "Sold" : "Reserved"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingImageGallery;
