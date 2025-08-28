import React from "react";

const ListingMap = ({ latitude, longitude, locationText }) => {
  if (!latitude || !longitude) {
    return null;
  }

  // Construct the OpenStreetMap embed URL
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${
    longitude - 0.01
  },${latitude - 0.01},${longitude + 0.01},${
    latitude + 0.01
  }&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div>
      <h3 className="font-semibold text-slate-800 mb-2">Location</h3>
      <p className="text-sm text-slate-600 mb-3">{locationText}</p>
      <div className="w-full h-48 rounded-lg overflow-hidden border">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={mapSrc}
          style={{ border: 0 }}
        ></iframe>
      </div>
    </div>
  );
};

export default ListingMap;
