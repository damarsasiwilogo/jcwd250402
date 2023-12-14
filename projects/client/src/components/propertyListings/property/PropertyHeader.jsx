import Heading from "../../Heading";
import FavoriteButton from "../../FavoriteButton";

const PropertyHeader = ({
  name,
  coverImage,
  propertyImages = [],
  city,
  province,
  id,
  country,
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={name} subtitle={`${city}, ${province}, ${country}`} />
        <FavoriteButton listingId={id} />
      </div>
      <div className="flex flex-col md:flex-row gap-x-1">
        <div className="relative w-full h-full overflow-hidden rounded-lg md:w-1/2">
          <img
            src={`http://localhost:8000/api/property-asset/${coverImage}`}
            className="object-cover w-full h-full"
            alt="listing"
          />
        </div>
        {propertyImages && propertyImages.length > 0 && (
          <div className="w-full md:w-1/2">
            <div className="h-full grid-cols-2 grid-rows-2 gap-2 md:grid">
              {propertyImages.slice(0, 4).map((imageObject, index) => (
                <img
                  key={index}
                  src={`http://localhost:8000/api/property-asset/${imageObject.image}`}
                  className="object-cover w-full h-full rounded-lg"
                  alt="listing"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PropertyHeader;
