import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import Heading from "../Heading";
import api from "../../api";
import { toast } from "sonner";

import useRoomDeleteModal from "../hooks/useRoomDeleteModal";

const PropertyDelete = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const roomDeleteModal = useRoomDeleteModal();
  const { openRoomDeleteModal } = location.state || {};

  const deleteHandler = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await api.delete(
        `/property/:propertyId/room/delete/${roomDeleteModal.roomId}}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Property deleted successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting property:", error.message);
      toast.error("Error deleting property");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (openRoomDeleteModal) {
      roomDeleteModal.onOpen();
    }
  });

  const bodyContent = (
    <div className="flex flex-col justify-evenly">
      <Heading
        title={"Are you sure you want to delete this property?"}
        subtitle={
          "All the data will be lost, and this action cannot be undone."
        }
      />
      <div className="flex flex-row mt-14 gap-x-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={roomDeleteModal.onClose}
          className={`
            relative
            disabled:opacity-70
            disabled:cursor-not-allowed
            rounded-lg
            hover:opacity-40
            transition
            w-full
            border-2
            p-4
            bg-white
            text-black
            border-black
            font-semibold
            ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={deleteHandler}
          className={`
            relative
            disabled:opacity-70
            disabled:cursor-not-allowed
            rounded-lg
            hover:opacity-80
            transition
            w-full
            border-2
            p-4
            bg-red-600
            text-red-200
            font-semibold
            border-neutral-500
            ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          Remove Property
        </button>
      </div>
    </div>
  );
  return (
    <>
      <Modal
        disabled={isLoading}
        isOpen={roomDeleteModal.isOpen}
        onClose={roomDeleteModal.onClose}
        title="Delete Room"
        body={bodyContent}
      />
    </>
  );
};

export default PropertyDelete;
