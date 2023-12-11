import { useSelector, useDispatch } from "react-redux";
import { paymentModalSlice } from "./modalSlice";

const usePaymentModal = () => {
  const state = useSelector((state) => state.paymentModal);
  const dispatch = useDispatch();

  const setBookingId = (propertyId) => {
    dispatch(paymentModalSlice.actions.setBookingId(propertyId));
  };

  return {
    isOpen: state.isOpen,
    propertyId: state.bookingId,
    onOpen: () => dispatch(paymentModalSlice.actions.openPaymentModal()),
    onClose: () => dispatch(paymentModalSlice.actions.closePaymentModal()),
    setBookingId,
  };
};

export default usePaymentModal;
