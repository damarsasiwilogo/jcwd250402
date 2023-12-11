import React from "react";
import Button from "../Button";
import DatePicker from "../inputs/Calendar";

const ListingReservation = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
  maxGuests,
  guestCount,
  setGuestCount,
}) => {
  const priceFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  price = priceFormatter.format(price);
  totalPrice = priceFormatter.format(totalPrice);

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden shadow-xl">
      <div className="flex flex-row items-center justify-evenly">
        <div className="flex flex-row items-center gap-1 p-4">
          <div className="text-2xl font-semibold">{price}</div>
          <div className="font-light text-neutral-600">/ night</div>
        </div>
        <div className="text-xl font-semibold">Guests:</div>
        <div className="flex flex-row items-center gap-2 p-4">
          <button
            className={`rounded-full border-[1px] border-neutral-200 w-8 h-8 flex items-center justify-center ${
              guestCount === 0 ? "opacity-50 cursor-not-allowed" : ""
            }}`}
            onClick={() => {
              if (guestCount > 0) setGuestCount(guestCount - 1);
            }}
          >
            -
          </button>
          <div className="rounded-full border-[1px] border-neutral-200 w-8 h-8 flex items-center justify-center">
            {guestCount}
          </div>
          <button
            className={`rounded-full border-[1px] border-neutral-200 w-8 h-8 flex items-center justify-center ${
              guestCount === maxGuests ? "opacity-50 cursor-not-allowed" : ""
            }}`}
            onClick={() => {
              if (guestCount < maxGuests) setGuestCount(guestCount + 1);
            }}
          >
            +
          </button>
        </div>
      </div>
      <hr />
      <DatePicker
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => onChangeDate(value.selection)}
      />
      <hr />
      <div className="p-4">
        <Button
          disabled={disabled || !guestCount || !dateRange}
          label="Reserve"
          onClick={onSubmit}
        />
      </div>
      <hr />
      <div className="flex flex-row items-center justify-between p-4 text-lg font-semibold">
        <div>Total:</div>
        <div>{totalPrice}</div>
      </div>
    </div>
  );
};

export default ListingReservation;
