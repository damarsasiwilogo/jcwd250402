import { toast } from "sonner";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "../FavoriteButton";
import { format } from "date-fns";

import { Button } from "../";
import { useSelector } from "react-redux";
import usePaymentModal from "../hooks/usePaymentModal";

const BookingCards = ({
  bookingData,
  onAction,
  disabled,
  actionLabel,
  actionId,
}) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const paymentModal = usePaymentModal();

  const onCancelBooking = async (e) => {
    e.stopPropagation();
    try {
      const handleDelete = await api.delete(`/booking/${bookingData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (handleDelete.status === 200) {
        toast.success("Bookings Successfully Cancelled");
        navigate(0);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const reservationDate = () => {
    if (!bookingData.startDate || !bookingData.endDate) {
      return null;
    }

    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  };

  return (
    <div
      key={bookingData.id}
      className="col-span-1 cursor-pointer group"
      onClick={() => navigate(`/property/${bookingData.property.id}`)}
    >
      <div className="flex flex-col w-full gap-2">
        <div className="relative w-full overflow-hidden aspect-square rounded-xl">
          <img
            src={`http://localhost:8000/api/property-asset/${bookingData.property.coverImage}`}
            alt="listings"
            className="object-cover w-full h-full transition group-hover:scale-110 "
          />
          <div className="absolute top-3 right-3">
            <FavoriteButton listingId={bookingData.property.id} />
          </div>
        </div>
        <div className="text-lg font-semibold">
          <div>{bookingData.property.propertyName}</div>
          <div className="text-sm font-light">{reservationDate()}</div>
          <div className="text-sm font-light">
            {bookingData.guestCount > 1 ? (
              <div>{bookingData.guestCount} Guests</div>
            ) : (
              <div>{bookingData.guestCount} Guest</div>
            )}
          </div>
          <div className="font-semibold">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(bookingData.totalPrice)}
          </div>
        </div>

        <div>
          {bookingData.status === "pending payment" && (
            <div
              className="px-2 py-1 text-xs font-semibold text-center rounded-md text-neutral-100 bg-neutral-600"
              style={{ textTransform: "capitalize" }}
            >
              {bookingData.status}
            </div>
          )}
          {bookingData.status === "pending confirmation" && (
            <div
              className="px-2 py-1 text-xs font-semibold text-center rounded-lg text-neutral-100 bg-neutral-800"
              style={{ textTransform: "capitalize" }}
            >
              {bookingData.status}
            </div>
          )}
          {bookingData.status === "cancelled" && (
            <div
              className="px-2 py-1 text-xs font-semibold text-center bg-red-600 rounded-lg text-neutral-100"
              style={{ textTransform: "capitalize" }}
            >
              {bookingData.status}
            </div>
          )}
          {bookingData.status === "confirmed" && (
            <div
              className="px-2 py-1 text-xs font-semibold text-center rounded-lg text-neutral-100 bg-primary"
              style={{ textTransform: "capitalize" }}
            >
              {bookingData.status}
            </div>
          )}
        </div>

        <div className="flex flex-row gap-1">
          {bookingData.status === "pending payment" && (
            <>
              <Button
                disabled={disabled}
                small
                label="Upload Payment"
                onClick={(e) => {
                  e.stopPropagation();
                  paymentModal.setBookingId(bookingData.id);
                  paymentModal.onOpen();
                }}
              />
              <Button
                disabled={disabled}
                small
                label="Cancel Booking"
                onClick={onCancelBooking}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCards;
