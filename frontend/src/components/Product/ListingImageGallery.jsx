const ListingImageGallery = ({ imageUrl, title, isAvailable, status }) => (
  <div className="relative">
    <img
      src={imageUrl}
      alt={title}
      className="object-contain rounded-sm w-full h-full"
    />
    {!isAvailable && (
      <div className="absolute bottom-0 left-0 w-full bg-green-600 py-1 text-center z-10">
        <span className="text-white text-xs font-bold uppercase tracking-widest">
          {status === "completed" ? "Sold" : "Reserved"}
        </span>
      </div>
    )}
  </div>
);

export default ListingImageGallery;
