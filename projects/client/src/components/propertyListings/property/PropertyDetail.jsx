import { useState, useEffect } from "react";
import { useCountries } from "../../hooks/useLocation";
import propertyAmenities from "../../../constants/propertyAmenities";
import propertyTypes from "../../../constants/propertyTypes";
import Map from "../../Map";
import { HoverCard, Text, Group, Button } from "@mantine/core";
import { MdVerified } from "react-icons/md";

const PropertyDetail = ({
  tenantName,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  propertyType,
  propertyAmenity,
  latitude,
  longitude,
  tenantImg,
  bedCount,
  tenantVerified,
  tenantMemberSince,
}) => {
  const locationValue = [latitude, longitude];
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const { getByValue } = useCountries(locationValue);

  useEffect(() => {
    const selected = propertyTypes.find((icon) => icon.value === propertyType);
    setSelectedIcon(selected ? selected.icon : null);
    setSelectedValue(
      selected
        ? selected.value.charAt(0).toUpperCase() + selected.value.slice(1)
        : null
    );
  }, [propertyType]);

  useEffect(() => {
    const amenitiesData = propertyAmenity.map((amenityId) => {
      return propertyAmenities.find(
        (amenity) => amenity.value === amenityId.amenity
      );
    });
    setSelectedAmenities(amenitiesData);
  }, [propertyAmenity]);

  const formattedDate = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long", // Use "short" for abbreviated month name
  }).format(new Date(tenantMemberSince));

  return (
    <div className="flex flex-col col-span-4 gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-6 mb-3 text-xl font-semibold ">
          <img
            src={`http://localhost:8000/api/profile-picture/${tenantImg}`}
            alt=""
            className="rounded-full w-14 h-14"
          />
          <div className="flex flex-col gap-0">
            <div>Hosted by {tenantName}</div>
            <div className="text-sm font-light">
              Member Since: {formattedDate}
            </div>
            {tenantVerified ? (
              <Group justify="start">
                <HoverCard width={350} shadow="md">
                  <HoverCard.Target>
                    <Button p={0} bg={"none"} style={{ color: "#0256EE" }}>
                      Verified Host
                      <MdVerified size={20} className="ml-1" />
                    </Button>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="sm">
                      A verified host means that this host has provided their
                      government-issued ID and have been verified by our team as
                      the person who will be hosting you.
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Group>
            ) : (
              <div>
                <span className="text-sm text-neutral-800">
                  Unverified Host
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row items-center font-light text-center text-neutral-500">
          <div className="flex flex-col items-center justify-center px-4 text-center border-r">
            <div>Guests</div>
            <div>{guestCount}</div>
          </div>
          <div className="flex flex-col items-center justify-center px-4 text-center border-r">
            <div>Rooms</div>
            <div>{roomCount}</div>
          </div>
          <div className="flex flex-col items-center justify-center px-4 text-center border-r">
            <div>Beds</div>
            <div>{bedCount}</div>
          </div>
          <div className="flex flex-col items-center justify-center px-4 text-center">
            <div>Bathrooms</div>
            <div>{bathroomCount}</div>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex flex-col gap-4">
        <label className="text-lg font-semibold" htmlFor="">
          Type
        </label>
        <div className="flex flex-row items-center gap-3 text-lg font-semibold text-neutral-900">
          <div>{selectedIcon}</div>
          {selectedValue}
        </div>
      </div>
      <hr />
      <label className="text-lg font-semibold" htmlFor="">
        Description
      </label>
      <div className="text-lg font-light text-neutral-600">{description}</div>
      <hr />
      <label className="text-lg font-semibold" htmlFor="">
        Amenities
      </label>
      <div className="grid w-[100vw] md:w-full grid-cols-2 grid-rows-2">
        {selectedAmenities.map((amenity, index) => (
          <div key={index} className="flex flex-row items-center gap-4">
            {amenity.icon}
            <div className="text-lg font-semibold">{amenity.label}</div>
          </div>
        ))}
      </div>
      <Map center={locationValue} />
    </div>
  );
};

export default PropertyDetail;
