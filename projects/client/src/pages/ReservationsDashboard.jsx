import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { IoPeople } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import useProofImageModal from "../components/hooks/useProofImageModal";

const PropertiesDashboard = () => {
  const [bookingData, setBookingData] = useState([]);
  const navigate = useNavigate();
  const proofImageModal = useProofImageModal();

  const fetchPropertiesData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/booking`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data.bookings;

      if (response.status === 200) {
        setBookingData(data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchPropertiesData();
  }, []);

  const formateDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const formatDateShort = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-ID", {
      day: "numeric",
      month: "short",
    });
  };

  const priceFormatter = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const token = useSelector((state) => state.auth.token);

  const rejectHandler = async (id) => {
    try {
      const response = await api.patch(
        `/booking/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Booking rejected");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const acceptHandler = async (id) => {
    try {
      const response = await api.patch(
        `/booking/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Booking Accepted");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!bookingData || bookingData.length === 0)
    return (
      <div className="">
        <div className="flex justify-between mb-8">
          <h1 className="ml-2 text-3xl font-normal ">Reservations</h1>
        </div>
        <table className="w-full ">
          <thead>
            <tr>
              <th className="px-4 py-2 border-gray-200">Status</th>
              <th className="px-4 py-2 border-gray-200">Guest</th>
              <th className="px-4 py-2 border-gray-200">
                <IoPeople />
              </th>
              <th className="px-4 py-2 border-gray-200">Reserved</th>
              <th className="px-4 py-2 border-gray-200">Property</th>
              <th className="px-4 py-2 border-gray-200">Stay date</th>
              <th className="px-4 py-2 border-gray-200">Total</th>
              <th className="px-4 py-2 border-gray-200">Proof</th>
              <th className="px-4 py-2 border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="flex items-center justify-center ">
              <td className="px-4 py-2 border-gray-200">No data</td>
            </tr>
          </tbody>
        </table>
      </div>
    );

  return (
    <div className="">
      <div className="flex justify-between mb-8">
        <h1 className="ml-2 text-3xl font-normal ">Reservations</h1>
      </div>
      <table className="w-full ">
        <thead>
          <tr>
            <th className="px-4 py-2 border-gray-200">Status</th>
            <th className="px-4 py-2 border-gray-200">Guest</th>
            <th className="px-4 py-2 border-gray-200">
              <IoPeople />
            </th>
            <th className="px-4 py-2 border-gray-200">Reserved</th>
            <th className="px-4 py-2 border-gray-200">Property</th>
            <th className="px-4 py-2 border-gray-200">Stay date</th>
            <th className="px-4 py-2 border-gray-200">Total</th>
            <th className="px-4 py-2 border-gray-200">Proof</th>
            <th className="px-4 py-2 border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody className="">
          {bookingData.map((booking) => (
            <tr key={booking.id} className="border-b hover:bg-primary/10">
              {/* BOOKING STATUS */}
              <td className="flex flex-row items-start justify-start px-4 py-2 border-gray-200">
                <div>
                  <span
                    className={`px-[10px] py-[1px] rounded-full 
                    ${booking.status === "pending payment" && "bg-blue-100"}
                    ${
                      booking.status === "pending confirmation" && "bg-blue-100"
                    }
                    ${booking.status === "rejected" && "bg-red-500"}
                    ${booking.status === "cancelled" && "bg-red-500"}
                    ${booking.status === "confirmed" && "bg-primary"}
                    ${booking.status === "completed" && "bg-primary"}
                    `}
                  ></span>
                </div>
                <div
                  className="flex items-start justify-start ml-2 gap-x-4"
                  style={{ textTransform: "capitalize" }}
                >
                  {booking.status}
                </div>
              </td>
              {/* RENTER NAME */}
              <td className="items-center justify-center px-4 py-2 border-gray-200 ">
                {booking.renter.fullname}
              </td>
              {/* GUEST COUNT */}
              <td className="items-center justify-center px-4 py-2 border-gray-200 ">
                {booking.guestCount}
              </td>
              {/* RESERVED DATE */}
              <td className="items-center justify-center px-4 py-2 border-gray-200 ">
                {formateDate(booking.createdAt)}
              </td>
              {/* PROPERTY NAME */}
              <td
                onClick={() => navigate(`/property/${booking.property.id}`)}
                className="items-center justify-center px-4 py-2 border-gray-200 cursor-pointer hover:text-primary"
              >
                {booking.property.propertyName}
              </td>
              {/* STAY DATE */}
              <td className="items-center justify-center px-4 py-2 border-gray-200 ">
                {formatDateShort(booking.startDate)} -{" "}
                {formatDateShort(booking.endDate)}
              </td>
              {/* TOTAL PRICE */}
              <td className="items-center justify-center px-4 py-2 border-gray-200 ">
                {priceFormatter(booking.totalPrice)}
              </td>
              {/* PROOF OF PAYMENT */}
              <td className="items-center justify-center px-4 py-2 border-gray-200 hover:text-primary hover:cursor-pointer">
                {booking.payment && booking.payment.paymentProof && (
                  <button
                    onClick={() => {
                      proofImageModal.setImageUrl(booking.payment.paymentProof);
                      proofImageModal.onOpen();
                    }}
                  >
                    <CiImageOn size={32} />
                  </button>
                )}
              </td>
              {/* ACTIONS */}
              {booking.status === "pending confirmation" && (
                <td className="flex flex-row items-center justify-center px-4 py-2 border-gray-200">
                  <div className="flex gap-2">
                    <button
                      disabled={booking.status !== "pending confirmation"}
                      onClick={() => rejectHandler(booking.id)}
                      className={`text-red-400 hover:text-red-600 ${
                        booking.status !== "pending confirmation" &&
                        "cursor-not-allowed opacity-90"
                      }`}
                    >
                      <CiCircleRemove size={32} />
                    </button>
                    <button
                      disabled={booking.status !== "pending confirmation"}
                      onClick={() => acceptHandler(booking.id)}
                      className={`hover:text-primary ${
                        booking.status !== "pending confirmation" &&
                        "cursor-not-allowed opacity-90:"
                      }`}
                    >
                      <CiCircleCheck size={32} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertiesDashboard;
