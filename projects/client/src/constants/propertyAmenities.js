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

const amenities = [
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
];

export default amenities;
