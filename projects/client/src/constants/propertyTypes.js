import { BsHouseDoor } from "react-icons/bs";
import { PiBuildingsBold, PiWarehouseDuotone } from "react-icons/pi";
import { GiSpookyHouse } from "react-icons/gi";
import { MdApartment, MdOutlineBedroomParent } from "react-icons/md";

const icons = [
  {
    icon: <BsHouseDoor className="w-8 h-8" />,
    value: "house",
  },
  {
    icon: <MdApartment className="w-8 h-8" />,
    value: "apartment",
  },
  {
    icon: <PiWarehouseDuotone className="w-8 h-8" />,
    value: "guesthouse",
  },
  {
    icon: <GiSpookyHouse className="w-8 h-8" />,
    value: "villa",
  },
  {
    icon: <PiBuildingsBold className="w-8 h-8" />,
    value: "hotel",
  },
  {
    icon: <MdOutlineBedroomParent className="w-8 h-8" />,
    value: "room",
  },
];

export default icons;
