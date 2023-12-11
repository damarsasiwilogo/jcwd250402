import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import usePropertyDeleteModal from "../components/hooks/usePropertyDeleteModal.js";
import { Menu, Button, Text, rem } from "@mantine/core";
import { IoPeople } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";

const PropertiesDashboard = () => {
  const [bookingData, setBookingData] = useState([]);
  const propertyDeleteModal = usePropertyDeleteModal();

  const fetchPropertiesData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/booking`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data.booking;

      if (response.status === 200) {
        setBookingData(data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error.message);
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
      minimumFractionDigits: 0, // Set minimumFractionDigits to 0 to exclude decimal values
    }).format(price);
  };

  return (
    <div className="">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-normal ">Reservations</h1>
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
          {bookingData.map((booking) => (
            <tr key={booking.id} className="border-b">
              <td className="items-center justify-center px-4 py-2 border-gray-200">
                <div
                  className="flex items-start justify-start ml-2 gap-x-4"
                  style={{ textTransform: "capitalize" }}
                >
                  {booking.status}
                </div>
              </td>
              <td className="items-center justify-center px-4 py-2 border-gray-200 ">
                {booking.renter.fullname}
              </td>
              <td className="items-center justify-center px-4 py-2 border-gray-200 ">
                {booking.guestCount}
              </td>
              <td className="items-center justify-center px-4 py-2 border-gray-200 ">
                {formateDate(booking.createdAt)}
              </td>
              <td className="items-center justify-center px-4 py-2 border-gray-200 ">
                {booking.property.propertyName}
              </td>
              <td className="items-center justify-center px-4 py-2 border-gray-200 ">
                {formatDateShort(booking.startDate)} -{" "}
                {formatDateShort(booking.endDate)}
              </td>
              <td className="items-center justify-center px-4 py-2 border-gray-200 ">
                {priceFormatter(booking.totalPrice)}
              </td>
              <td className="items-center justify-center px-4 py-2 border-gray-200 hover:text-primary hover:cursor-pointer">
                <CiImageOn size={32} />
              </td>
              <td className="flex flex-row items-center justify-center px-4 py-2 border-gray-200">
                <div className=""></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertiesDashboard;
