import React, { useEffect, useState } from "react";
import CloseIcon from "../ui/CloseIcon";
import ChevronLeftIcon from "../ui/ChevronLeftIcon";
import ChevronRightIcon from "../ui/ChevronRightIcon";

const ListingImageGallery = ({ images = [], status }) => {
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isAvailable = status === "available";

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full bg-slate-200 rounded-lg flex items-center justify-center">
        <span className="text-slate-500">No Image Available</span>
      </div>
    );
  }

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const mainImage = images[0];
  const thumbnailImages = images.slice(1, 5);
  const remainingImagesCount = images.length > 5 ? images.length - 5 : 0;

  return (
    <>
      {images.length == 1 ? (
        <div className="w-full lg:w-7/12">
          <div className="relative w-full h-[70vh] max-h-[600px] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={images[0].image}
              alt={"Main listing"}
              className="w-full h-full object-contain"
              onClick={() => openLightbox(0)}
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
      ) : (
        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[60vh] max-h-[900px]">
          <div className="col-span-1 row-span-2 group">
            <img
              src={mainImage.image}
              alt="Main listing"
              className="w-full h-full object-cover rounded-md cursor-pointer"
              onClick={() => openLightbox(0)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x600/e2e8f0/4a5568?text=EcoTroc";
              }}
            />
          </div>

          {thumbnailImages.map((img, index) => (
            <div key={img.id} className="relative col-span-1 row-span-1 group">
              <img
                src={img.image}
                alt={`Listing thumbnail ${index + 1}`}
                className="w-full h-full object-cover rounded-md cursor-pointer"
                onClick={() => openLightbox(index + 1)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/300x300/e2e8f0/4a5568?text=EcoTroc";
                }}
              />
              {index === 3 && remainingImagesCount > 0 && (
                <div
                  className="absolute inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center rounded-md cursor-pointer"
                  onClick={() => openLightbox(index + 1)}
                >
                  <span className="text-white text-2xl font-bold">
                    +{remainingImagesCount}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {isLightboxOpen && (
        <div
          // Added backdrop-blur and changed background opacity
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
            onClick={closeLightbox}
          >
            <CloseIcon />
          </button>

          <button
            className="absolute left-4 text-white hover:text-gray-300 p-2 rounded-full backdrop-blur-sm bg-opacity-30 hover:bg-opacity-50 z-50"
            onClick={goToPrevious}
          >
            <ChevronLeftIcon />
          </button>

          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img
              src={images[currentImageIndex].image}
              alt={`Listing image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            {!isAvailable && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-auto bg-slate-800 bg-opacity-80 py-1.5 px-4 rounded-md text-center z-10">
                <span className="text-white text-xs font-bold uppercase tracking-widest">
                  {status === "completed" ? "Sold" : "Reserved"}
                </span>
              </div>
            )}
          </div>

          <button
            className="absolute right-4 text-white hover:text-gray-300 p-2 rounded-full backdrop-blur-sm bg-opacity-30 hover:bg-opacity-50 z-50"
            onClick={goToNext}
          >
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </>
  );
};

export default ListingImageGallery;
