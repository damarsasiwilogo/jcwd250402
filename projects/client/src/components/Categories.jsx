import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { BsHouseDoor } from "react-icons/bs";
import { PiBuildingsBold, PiWarehouseDuotone } from "react-icons/pi";
import { GiSpookyHouse } from "react-icons/gi";
import { MdApartment, MdOutlineBedroomParent } from "react-icons/md";
import CategoryBox from "./CategoryBox";
import Container from "./Container";

export const categories = [
  {
    label: "House",
    icon: BsHouseDoor,
    description: "",
  },
  {
    label: "Apartment",
    icon: MdApartment,
    description: "",
  },
  {
    label: "Guesthouse",
    icon: PiWarehouseDuotone,
    description: "",
  },
  {
    label: "Villa",
    icon: GiSpookyHouse,
    description: "",
  },
  {
    label: "Hotel",
    icon: PiBuildingsBold,
    description: "",
  },
  {
    label: "Room",
    icon: MdOutlineBedroomParent,
    description: "",
  },
];

const Categories = () => {
  const location = useLocation();
  const params = useSearchParams();
  const isMainPage = location.pathname === "/";
  if (!isMainPage) return null;
  return (
    <Container>
      <div className="flex flex-row items-center justify-between pt-4 overflow-x-auto">
        {categories.map((category) => (
          <CategoryBox
            key={category.label}
            label={category.label}
            description={category.description}
            icon={category.icon}
          />
        ))}
      </div>
    </Container>
  );
};

export default Categories;
