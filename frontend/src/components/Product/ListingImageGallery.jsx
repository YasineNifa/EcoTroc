const ListingImageGallery = ({ imageUrl, title }) => (
  <div className="lg:w-9/12 flex justify-center">
    <img
      src={imageUrl}
      alt={title}
      // className="w-150 h-100 object-cover rounded-sm"
    />
  </div>
);

export default ListingImageGallery;
