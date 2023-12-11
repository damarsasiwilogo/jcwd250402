import { useState, useCallback } from "react";
import { TbPhotoPlus, TbTrash } from "react-icons/tb";

// ... (imports)

const ImageUpload = ({ onChange, onDelete, value }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    onChange(file); // Pass the selected file to the onChange prop
  };

  const handleDelete = () => {
    setSelectedFile(null);
    onDelete();
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-4 p-20 transition border-2 border-dashed cursor-pointer hover:opacity-70 border-neutral-300 text-neutral-600">
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div
        onClick={() => {
          document.getElementById("fileInput").click();
        }}
      >
        <TbPhotoPlus size={50} />
        <div className="text-lg font-semibold">Click to upload</div>

        {selectedFile && (
          <div className="absolute inset-0 w-full h-full">
            <img
              style={{ objectFit: "cover" }}
              src={URL.createObjectURL(selectedFile)}
              alt="House"
            />
          </div>
        )}
      </div>

      {selectedFile && (
        <button
          onClick={handleDelete}
          className="absolute p-1 text-white bg-red-500 rounded-md top-2 right-2 hover:bg-red-600"
        >
          <TbTrash size={20} />
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
