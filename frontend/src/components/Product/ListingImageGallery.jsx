const ListingImageGallery = ({ imageUrl, title }) => (
  <div className="w-full lg:w-7/12">
    {" "}
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-auto object-cover rounded-sm"
    />{" "}
  </div>
);

export default ListingImageGallery;
