import { useState } from "react";
import { Image } from "@mantine/core";
import Modal from "./Modal";
import { useSelector } from "react-redux";
import useProofImageModal from "../hooks/useProofImageModal";

const ProofImageModal = () => {
  const proofImageModal = useProofImageModal();
  const imageUrl = useSelector((state) => state.proofImageModal.imageUrl);

  const bodyContent = (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center"></div>
        <div className="flex flex-col items-center justify-center">
          <Image src={`http://localhost:8000/api/payment/${imageUrl}`} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Modal
        isOpen={proofImageModal.isOpen}
        onClose={() => {
          proofImageModal.onClose();
        }}
        title={"Proof of Payment"}
        body={bodyContent}
      />
    </>
  );
};

export default ProofImageModal;
