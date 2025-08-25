// const ListingImageGallery = ({ imageUrl, title, isAvailable, status }) => (
//   <div className="relative">
//     <img
//       src={imageUrl}
//       alt={title}
//       className="object-contain rounded-sm w-full h-full"
//     />
//     {!isAvailable && (
//       <div className="absolute bottom-0 left-0 w-full bg-green-600 py-1 text-center z-10">
//         <span className="text-white text-xs font-bold uppercase tracking-widest">
//           {status === "completed" ? "Sold" : "Reserved"}
//         </span>
//       </div>
//     )}
//   </div>
// );

// export default ListingImageGallery;

const ListingImageGallery = ({ imageUrl, title, status }) => {
  const isAvailable = status === "available";

  return (
    // The relative class is for the status banner
    <div className="relative w-full rounded-lg overflow-hidden border bg-slate-100">
      {/* KEY IMPROVEMENT:
        - `aspect-square` forces the container into a perfect square, unifying its dimensions on all pages.
        - This is fully responsive.
      */}
      <div className="aspect-square">
        <img
          src={imageUrl}
          alt={title}
          /*
            KEY IMPROVEMENT:
            - `object-cover` makes the image fill the entire container without distortion, cropping excess.
            - This eliminates empty space and provides a consistent, professional look.
          */
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x600/e2e8f0/4a5568?text=EcoTroc";
          }}
        />
      </div>

      {!isAvailable && (
        <div className="absolute bottom-0 left-0 w-full bg-slate-800 bg-opacity-80 py-1.5 text-center z-10">
          <span className="text-white text-xs font-bold uppercase tracking-widest">
            {status === "completed" ? "Sold" : "Reserved"}
          </span>
        </div>
      )}
    </div>
  );
};

export default ListingImageGallery;
