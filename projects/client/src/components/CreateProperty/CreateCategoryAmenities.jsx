import React, { useState, useEffect, useRef } from "react";
import { FaBath, FaRegSnowflake } from "react-icons/fa";
import {
  PiBroom,
  PiCookingPot,
  PiKnifeBold,
  PiTelevisionSimple,
} from "react-icons/pi";
import { LuUtensils, LuWaves } from "react-icons/lu";
import { BiSolidDryer } from "react-icons/bi";
import { IoWaterOutline, IoWifiOutline } from "react-icons/io5";

const CreatePropertyAmenities = ({
  count,
  onChange,
  onUpdateFormData,
  disabled,
  onAmenitiesChange,
  selectedAmenities,
}) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const prevSelectedValues = useRef([]);

  const activeHandler = (value) => {
    setSelectedValues((prevSelectedValues) => {
      const isSelected = prevSelectedValues.includes(value);

      if (isSelected) {
        // If the value is already selected, remove it
        return prevSelectedValues.filter((val) => val !== value);
      } else {
        // If the value is not selected, add it to the array
        return [...prevSelectedValues, value];
      }
    });
  };

  useEffect(() => {
    // Set initial selected values based on fetched data
    if (Array.isArray(selectedAmenities) && selectedAmenities.length > 0) {
      const initialSelected = selectedAmenities.map(
        (amenityObj) => amenityObj.amenity
      );
      if (!isEqualArrays(initialSelected, selectedValues)) {
        setSelectedValues(initialSelected);
      }
    }

    // Use useEffect to handle side effects (calling onAmenitiesChange)
    const hasChanged =
      JSON.stringify(selectedValues) !==
      JSON.stringify(prevSelectedValues.current);
    if (hasChanged) {
      onAmenitiesChange(selectedValues);
      prevSelectedValues.current = selectedValues;
    }
  }, [selectedValues, onAmenitiesChange, selectedAmenities]);

  // Helper function to check if two arrays are equal
  function isEqualArrays(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  return (
    <div className="">
      <div className="flex flex-col mt-4 border-b p-9 gap-y-3">
        <label htmlFor="property_type" className="text-lg font-medium">
          What amenities does your property have?
        </label>
        <div className="grid items-center justify-start md:w-[70%] grid-cols-2 md:grid md:grid-cols-5 gap-4 md:grid-rows-2">
          {[
            {
              icon: <FaBath size={25} />,
              label: "Toilet Amenities",
              value: "bathroom",
            },
            {
              icon: <FaRegSnowflake size={25} />,
              label: "Air Conditioning",
              value: "airCondition",
            },
            {
              icon: <PiBroom size={25} />,
              label: "Cleaning Products",
              value: "cleaning",
            },
            {
              icon: <PiCookingPot size={25} />,
              label: "Cooking Basics",
              value: "villa",
            },
            {
              icon: <LuUtensils size={25} />,
              label: "Dishes and silverwares",
              value: "silverwares",
            },
            {
              icon: <BiSolidDryer size={25} />,
              label: "Dryer",
              value: "dryer",
            },
            {
              icon: <LuWaves size={25} />,
              label: "Hairdryer",
              value: "hairdryer",
            },
            {
              icon: <PiKnifeBold size={25} />,
              label: "Kitchen",
              value: "kitchen",
            },
            {
              icon: <PiTelevisionSimple size={25} />,
              label: "Television",
              value: "television",
            },
            {
              icon: <IoWaterOutline size={25} />,
              label: "Washer",
              value: "washer",
            },
            {
              icon: <IoWifiOutline size={25} />,
              label: "Wifi",
              value: "wifi",
            },
          ].map((amenity, index) => (
            <div
              key={index}
              disabled={disabled}
              onClick={() => {
                activeHandler(amenity.value);
              }}
              className={`p-9 border-2 md:p-9 w-40 h-40 border-black overflow-auto rounded-lg cursor-pointer items-center justify-center ${
                selectedValues.includes(amenity.value)
                  ? "border-primary bg-primary bg-opacity-[0.15]"
                  : "border-black bg-white"
              }`}
            >
              {amenity.icon}
              <span>{amenity.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatePropertyAmenities;
