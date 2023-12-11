import { useState, useEffect } from "react";
import { BsHouseDoor } from "react-icons/bs";
import { PiBuildingsBold, PiWarehouseDuotone } from "react-icons/pi";
import { GiSpookyHouse } from "react-icons/gi";
import { MdApartment, MdOutlineBedroomParent } from "react-icons/md";

const CreatePropertyType = ({ value, setValue, disabled, selectedValue }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    // Set the active index based on the selected value
    const index = [
      "house",
      "apartment",
      "guesthouse",
      "villa",
      "hotel",
      "room",
    ].indexOf(selectedValue);
    setActiveIndex(index);
  }, [selectedValue]);

  const activeHandler = (index, propertyType) => {
    setActiveIndex(index);
    setValue({ target: { name: "propertyType", value: propertyType } });
  };

  return (
    <div className="flex flex-col mt-4 border-b p-9 gap-y-3">
      <label htmlFor="property_type" className="text-lg font-medium">
        Which of these categories best describe your property?
      </label>
      <div className="grid items-center justify-start md:w-[70%] grid-cols-2 md:grid md:grid-cols-6 gap-5 md:grid-rows-1">
        {[
          {
            icon: <BsHouseDoor className="h-14 w-14" />,
            label: "House",
            value: "house",
          },
          {
            icon: <MdApartment className="h-14 w-14" />,
            label: "Apartment",
            value: "apartment",
          },
          {
            icon: <PiWarehouseDuotone className="h-14 w-14" />,
            label: "Guesthouse",
            value: "guesthouse",
          },
          {
            icon: <GiSpookyHouse className="h-14 w-14" />,
            label: "Villa",
            value: "villa",
          },
          {
            icon: <PiBuildingsBold className="h-14 w-14" />,
            label: "Hotel",
            value: "hotel",
          },
          {
            icon: <MdOutlineBedroomParent className="h-14 w-14" />,
            label: "Room",
            value: "room",
          },
        ].map((type, index) => (
          <div
            key={index}
            onClick={() => activeHandler(index, type.value)}
            disabled={disabled}
            className={`p-9 border-2 md:p-9 border-black rounded-lg cursor-pointer items-center justify-center ${
              activeIndex === index
                ? "border-primary bg-primary bg-opacity-[0.15]"
                : "border-black bg-white"
            }`}
          >
            {type.icon}
            <span>{type.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePropertyType;
