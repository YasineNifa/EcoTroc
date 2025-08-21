const ListingImageGallery = ({ imageUrl, title }) => (
  // <div className="flex justify-center">{/* lg:w-9/12  */}
  // </div>
  <img
    src={imageUrl}
    alt={title}
    className="object-contain rounded-sm w-full h-full"
  />
);

export default ListingImageGallery;
