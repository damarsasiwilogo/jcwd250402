import { useSelector, useDispatch } from "react-redux";
import { proofImageModalSlice } from "./modalSlice";

const useProofImageModal = () => {
  const state = useSelector((state) => state.proofImageModal);
  const dispatch = useDispatch();

  const setImageUrl = (ImageUrl) => {
    dispatch(proofImageModalSlice.actions.setImageUrl(ImageUrl));
  };

  return {
    isOpen: state.isOpen,
    paymentId: state.paymentId,
    onOpen: () => dispatch(proofImageModalSlice.actions.openProofImageModal()),
    onClose: () =>
      dispatch(proofImageModalSlice.actions.closeProofImageModal()),
    setImageUrl,
  };
};

export default useProofImageModal;
