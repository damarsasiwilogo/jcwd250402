import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { RiImageAddLine, RiDeleteBinLine } from "react-icons/ri";

const ImageUploader = ({ images, onUpdateFormData, disabled }) => {
  const [imagesState, setImagesState] = useState(images);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const imageFiles = acceptedFiles.filter((file) =>
        file.type.startsWith("image/")
      );

      setImagesState((prevImages) => [...prevImages, ...imageFiles]);
      onUpdateFormData([...imagesState, ...imageFiles]);
    },
    [imagesState, onUpdateFormData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: imagesState.length >= 5 || disabled,
  });

  const handleDelete = (index) => {
    setImagesState((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      onUpdateFormData(updatedImages);
      return updatedImages;
    });
  };

  return (
    <div className="div">
      <div className="flex flex-col w-full mt-2 p-9 justify md:flex-row">
        <div className="flex mr-5 -mx-2 gap-x-2">
          {Array.isArray(imagesState) &&
            imagesState.length > 0 &&
            imagesState.map((image, index) => (
              <div key={index} className="w-full p-2">
                <div className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Uploaded ${index + 1}`}
                    className="object-contain w-full h-56 rounded-md"
                  />
                  <button
                    className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2"
                    onClick={() => handleDelete(index)}
                  >
                    <RiDeleteBinLine />
                  </button>
                </div>
              </div>
            ))}
        </div>

        {images.length < 5 && (
          <div
            {...getRootProps()}
            className={`${isDragActive ? "bg-gray-100" : ""} flex-nowrap -mx-2`}
          >
            <input {...getInputProps()} />
            <div className="border-2 border-gray-300 border-dashed rounded-md cursor-pointer p-14 h-42">
              <div
                className={`cursor-pointer text-gray-600 h-32 flex flex-row items-center justify-center rounded-md ${
                  isDragActive ? "opacity-50" : ""
                }`}
              >
                <div className="flex flex-col items-center">
                  <RiImageAddLine size={40} />
                  <span className="mt-2 text-xs">
                    Drag a file here or{" "}
                    <span className="text-primary">browse</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
