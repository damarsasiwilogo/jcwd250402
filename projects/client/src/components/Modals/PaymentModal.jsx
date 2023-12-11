import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useDisclosure } from "@mantine/hooks";
import { LoadingOverlay, Box } from "@mantine/core";

import api from "../../api";
import { ImageUpload } from "../";

import usePaymentModal from "../hooks/usePaymentModal";
import Modal from "./Modal";
import Heading from "../Heading";
import { useSelector } from "react-redux";

const PaymentModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const paymentModal = usePaymentModal();
  const [visible, { toggle }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentImage, setPaymentImage] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const bookingId = useSelector((state) => state.paymentModal.bookingId);

  const handlePayment = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("paymentProof", paymentImage);

    try {
      const handlePayment = await api.post(
        `/booking/pay/${bookingId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (handlePayment.status === 201) {
        toast.success("Payment Successfully Uploaded");
        navigate(0);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setIsLoading(false);
  };

  const bodyContent = (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Heading
            title="Payment"
            subtitle="Please upload your payment receipt"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <ImageUpload
            onChange={(file) => {
              setPaymentImage(file);
            }}
            onDelete={() => {
              setPaymentImage(null);
            }}
            value={paymentImage}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Modal
        disabled={isLoading}
        isOpen={paymentModal.isOpen}
        onClose={() => {
          paymentModal.onClose();
        }}
        title={"Upload Proof of Payment"}
        actionLabel={"Upload"}
        body={bodyContent}
        onSubmit={handlePayment}
      />
    </>
  );
};

export default PaymentModal;
