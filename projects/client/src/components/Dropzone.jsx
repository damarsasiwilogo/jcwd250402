import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormik, Field } from "formik";
import * as Yup from "yup";
import { RiAddFill } from "react-icons/ri";

export default function Dropzone({ label, formik, field, id }) {
  const handlePhotoChange = (event) => {
    formik.setFieldValue(field, event.currentTarget.files[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      try {
        const file = acceptedFiles[0];
        formik.setFieldValue(field, file);

        const preview = URL.createObjectURL(file);
        setPreview(preview);
      } catch (error) {
        console.error("Error handling dropped file:", error);
      }
    },
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (formik.values[field]) {
      const preview = URL.createObjectURL(formik.values[field]);
      setPreview(preview);
    }

    return () => {
      if (formik.values[field]) {
        URL.revokeObjectURL(URL.createObjectURL(formik.values[field]));
      }
    };
  }, [formik.values[field]]);

  return (
    <>
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <div
        {...getRootProps()}
        className="flex items-center justify-center bg-white"
      >
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 bg-white border-2 border-gray-500 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {preview ? (
              <img
                src={preview}
                alt="Profile preview"
                className="object-cover w-full h-40 mb-2 rounded-lg"
              />
            ) : (
              <RiAddFill className="h-[40px] w-[40px] text-white bg-primary" />
            )}
            <p className="mt-5 text-sm text-gray-500">
              <span className="font-semibold text-primary">Add Image</span>
            </p>
          </div>
          <input
            {...getInputProps()}
            id={id}
            name={id}
            register={useFormik}
            type="file"
            className="hidden"
            accept="image/"
            multiple={false}
            onChange={handlePhotoChange}
          />
        </label>
      </div>

      {formik.errors.profilePicture && formik.touched.profilePicture && (
        <div className="text-red-500">{formik.errors.profilePicture}</div>
      )}
    </>
  );
}
