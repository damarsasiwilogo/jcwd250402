import React from "react";

const PropertyAmenities = ({ data }) => {
  return data.map((amenity, index) => {
    return (
      <div key={index} className="flex flex-row items-center gap-4">
        {amenity.icon}
        <div className="text-lg font-semibold">{amenity.label}</div>
      </div>
    );
  });
};

export default PropertyAmenities;
