import { useNavigate } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { useSelector } from "react-redux";

export default function FavoriteCard({ data, disabled }) {
  const user = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();
  return (
    <div
      key={data.id}
      className="col-span-1 cursor-pointer group"
      onClick={() => {
        navigate(`/property/${data.property.id}`);
      }}
    >
      <div className="flex flex-col w-full gap-2">
        <div className="relative w-full overflow-hidden aspect-square rounded-xl">
          <img
            src={`http://localhost:8000/api/property-asset/${data.property.coverImage}`}
            alt="listings"
            className="object-cover w-full h-full transition group-hover:scale-110"
          />
          <div className="absolute top-3 right-3">
            <FavoriteButton listingId={data.property.id} userId={user} />
          </div>
        </div>
        <div className="text-lg font-semibold">
          <div>{data.property.propertyName}</div>
        </div>
      </div>
    </div>
  );
}
