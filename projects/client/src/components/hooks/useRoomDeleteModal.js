import { useSelector, useDispatch } from "react-redux";
import { roomDeleteSlice } from "./modalSlice";

const useRoomDeleteModal = () => {
  const state = useSelector((state) => state.roomDelete);
  const dispatch = useDispatch();

  const setRoomId = (roomId) => {
    dispatch(roomDeleteSlice.actions.setRoomId(roomId));
  };

  const setPropertyId = (propertyId) => {
    dispatch(roomDeleteSlice.actions.setPropertyId(propertyId));
  };

  return {
    isOpen: state.isOpen,
    roomId: state.roomId,
    propertyId: state.propertyId,
    onOpen: () => dispatch(roomDeleteSlice.actions.openRoomDelete()),
    onClose: () => dispatch(roomDeleteSlice.actions.closeRoomDelete()),
    setRoomId,
    setPropertyId,
  };
};

export default useRoomDeleteModal;
