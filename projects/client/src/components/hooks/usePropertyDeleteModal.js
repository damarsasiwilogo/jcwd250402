import { useSelector, useDispatch } from "react-redux";
import { propertyDeleteSlice } from "./modalSlice";

const usePropertyDeleteModal = () => {
  const state = useSelector((state) => state.propertyDelete);
  const dispatch = useDispatch();

  const setPropertyId = (propertyId) => {
    dispatch(propertyDeleteSlice.actions.setPropertyId(propertyId));
  };

  return {
    isOpen: state.isOpen,
    propertyId: state.propertyId,
    onOpen: () => dispatch(propertyDeleteSlice.actions.openPropertyDelete()),
    onClose: () => dispatch(propertyDeleteSlice.actions.closePropertyDelete()),
    setPropertyId,
  };
};

export default usePropertyDeleteModal;
