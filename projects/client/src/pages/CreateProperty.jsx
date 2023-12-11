import { useState } from "react";
import api from "../api";
import { toast } from "sonner";
import { Formik, Form, useFormik } from "formik";
import Input from "../components/inputs/Input";
import {
  ImageUploader,
  CreateCategoryAmenities,
  CreatePropertyType,
} from "../components/CreateProperty";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Loader } from "@mantine/core";
import {
  CountrySelect,
  ProvinceSelect,
  CitySelect,
} from "../components/inputs";

const CreateProperty = () => {
  document.title = "Create New Property";
  const navigate = useNavigate();
  const [images] = useState([]);
  const [showRules, setShowRules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object({
    // propertyName: yup.string().required("Property name is required"),
    // description: yup.string().required("Description is required"),
    // price: yup.number().required("Price is required"),
    // bedCount: yup.number().required("Bed count is required"),
    // bedroomCount: yup.number().required("Bedroom count is required"),
    // maxGuestCount: yup.number().required("Max guest count is required"),
    // bathroomCount: yup.number().required("Bathroom count is required"),
    // propertyType: yup.string().required("Property type is required"),
    // district: yup.string().required("District is required"),
    // city: yup.object().required("City is required"),
    // province: yup.object().required("Province is required"),
    // country: yup.object().required("Country is required"),
    // streetAddress: yup.string().required("Street address is required"),
    // postalCode: yup.number().required("Postal code is required"),
    // propertyAmenities: yup.array().required("Property amenities is required"),
    // propertyRules: yup.array().required("Property rules is required"),
    // images: yup.array().required("Images are required"),
  });

  const formik = useFormik({
    initialValues: {
      propertyName: "",
      description: "",
      price: 0,
      bedCount: 0,
      bedroomCount: 0,
      maxGuestCount: 0,
      bathroomCount: 0,
      propertyType: "",
      district: "",
      city: "",
      province: "",
      country: "",
      streetAddress: "",
      latitude: 0,
      longitude: 0,
      postalCode: 0,
      propertyAmenities: [],
      propertyRules: [],
      images: [[]],
    },
    validationSchema: validationSchema,

    onSubmit: async () => {
      const token = localStorage.getItem("token");
      const isTenant = localStorage.getItem("isTenant");
      if (isTenant === "false" || isTenant === "null") {
        toast.error("Only tenants can create properties!");
        return;
      }
      const formData = new FormData();
      formData.append("propertyName", formik.values.propertyName);
      formData.append("description", formik.values.description);
      formData.append("price", formik.values.price);
      formData.append("bedCount", formik.values.bedCount);
      formData.append("bedroomCount", formik.values.bedroomCount);
      formData.append("maxGuestCount", formik.values.maxGuestCount);
      formData.append("bathroomCount", formik.values.bathroomCount);
      formData.append("propertyType", formik.values.propertyType);
      formData.append("district", formik.values.district);
      formData.append("city", formik.values.city.label);
      formData.append("province", formik.values.province.label);
      formData.append("country", formik.values.country.label);
      formData.append("streetAddress", formik.values.streetAddress);
      formData.append("latitude", formik.values.country.latitude);
      formData.append("longitude", formik.values.country.longitude);
      formData.append("postalCode", formik.values.postalCode);
      formik.values.propertyAmenities.forEach((amenity, index) => {
        formData.append(`propertyAmenities[${index}]`, amenity);
      });
      formik.values.propertyRules.forEach((rule, index) => {
        formData.append(`propertyRules[${index}]`, rule);
      });
      formik.values.images.forEach((image) => {
        formData.append(`images`, image);
      });
      try {
        const response = await api.post("/property/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        setIsSubmitting(true);
        if (response.status === 201) {
          setIsSubmitting(false);
          toast.success("Property created successfully");
          setIsSubmitting(false);
          navigate("/tenant/dashboard");
        }
      } catch (error) {
        setIsSubmitting(false);
        toast.error(error.response.data.message);
        if (error.status === 400) {
          toast.error(error.message);
        } else {
          toast.error(error.message);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={50} />
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    if (field === "images") {
      formik.setFieldValue((prevData) => ({
        ...prevData,
        images: value,
      }));
    } else {
      formik.setFieldValue(field, value);
    }
  };

  const handleAmenitiesChange = (updatedAmenities) => {
    formik.setFieldValue("propertyAmenities", updatedAmenities);
  };

  const handleImageUpdate = (updatedImages) => {
    formik.setFieldValue("images", updatedImages);
  };

  const handleIncrement = (property) => {
    formik.setFieldValue(property, formik.values[property] + 1);
  };

  const handleDecrement = (property) => {
    formik.setFieldValue(property, Math.max(formik.values[property] - 1, 0));
  };

  return (
    <div className="px-2 py-6">
      <div className="flex flex-col bg-white">
        <Formik
          initialValues={formik.initialValues}
          onSubmit={formik.handleSubmit}
        >
          <Form>
            {/* PROPERTY NAME */}
            <div className="flex flex-col border-b-2 p-9 gap-y-3">
              <label htmlFor="property_name" className="text-xl font-medium">
                What's your property name?
              </label>
              <input
                name="propertyName"
                type="text"
                placeholder="eg. Hotel in Shinjuku near station"
                className={`w-full p-4 text-xl border border-gray-400 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary
                ${isSubmitting ? "bg-gray-200" : "bg-white"}}`}
                value={formik.values.propertyName}
                onChange={formik.handleChange}
                disabled={isSubmitting}
              />
              {formik.touched.propertyName && formik.errors.propertyName ? (
                <div className="text-sm text-red-600">
                  {formik.errors.propertyName}
                </div>
              ) : null}
            </div>
            {/* PROPERTY TYPE */}
            <div>
              <CreatePropertyType
                value={formik.values.propertyType}
                setValue={formik.handleChange}
                disabled={isSubmitting}
              />
              {formik.touched.propertyType && formik.errors.propertyType ? (
                <div className="text-sm text-red-600">
                  {formik.errors.propertyType}
                </div>
              ) : null}
            </div>
            {/* PROPERTY LOCATION */}
            <div className="mb-4 border-b p-9">
              <label
                htmlFor="property_location"
                className="text-lg font-medium"
              >
                Where is your property located?
              </label>
              <div className="flex flex-col w-full p-9 gap-x-3 gap-y-3">
                <div className="flex flex-col gap-x-4 gap-y-3">
                  <label
                    htmlFor="property_location"
                    className="text-xl font-medium"
                  >
                    Country
                  </label>
                  <CountrySelect
                    value={formik.values.country}
                    onChange={(selectedCountry) =>
                      formik.setFieldValue("country", selectedCountry)
                    }
                  />

                  <label
                    htmlFor="property_location"
                    className="text-xl font-medium"
                  >
                    Province
                  </label>
                  <ProvinceSelect
                    value={formik.values.province}
                    onChange={(selectedProvince) =>
                      formik.setFieldValue("province", selectedProvince)
                    }
                    countryIsoCode={formik.values.country.value}
                  />
                  {formik.touched.province && formik.errors.province ? (
                    <div className="text-sm text-red-600">
                      {formik.errors.province}
                    </div>
                  ) : null}
                  <label
                    htmlFor="property_location"
                    className="text-xl font-medium"
                  >
                    City
                  </label>
                  <CitySelect
                    value={formik.values.city}
                    onChange={(selectedCity) =>
                      formik.setFieldValue("city", selectedCity)
                    }
                    countryIsoCode={formik.values.country.value}
                    provinceIsoCode={formik.values.province.value}
                  />
                  {formik.touched.city && formik.errors.city ? (
                    <div className="text-sm text-red-600">
                      {formik.errors.city}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col gap-x-4 w-[100%] gap-y-3 md:flex-row">
                  <Input
                    name="streetAddress"
                    label="Street Address"
                    type="text"
                    disabled={isSubmitting}
                    className={"md:w-[54.7vw]"}
                    onChange={(value) =>
                      handleInputChange("streetAddress", value)
                    }
                  />
                  {formik.touched.streetAddress &&
                  formik.errors.streetAddress ? (
                    <div className="text-sm text-red-600">
                      {formik.errors.streetAddress}
                    </div>
                  ) : null}
                  <Input
                    name="postalCode"
                    label="Postal Code"
                    disabled={isSubmitting}
                    className=""
                    type="number"
                    onChange={(value) => handleInputChange("postalCode", value)}
                  />
                  {formik.touched.postalCode && formik.errors.postalCode ? (
                    <div className="text-sm text-red-600">
                      {formik.errors.postalCode}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            {/* PROPERTY IMAGES */}
            <div className="p-9">
              <ImageUploader
                images={images}
                disabled={isSubmitting}
                onUpdateFormData={handleImageUpdate}
              />
              {formik.touched.images && formik.errors.images ? (
                <div className="text-sm text-red-600">
                  {formik.errors.images}
                </div>
              ) : null}
            </div>
            {/* PROPERTY COUNT */}
            <div className="p-9">
              <h1 className="mb-2 text-lg font-medium">
                How many guests can stay here?
              </h1>
              <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:grid-rows-2">
                <div className="flex flex-row justify-between w-full p-3 border-2 rounded-md">
                  <span>Guests:</span>
                  <div className="w-7 md:w-96" />
                  <button
                    disabled={isSubmitting}
                    type="button"
                    onClick={() => {
                      handleDecrement("maxGuestCount");
                    }}
                  >
                    <CiCircleMinus size={25} />
                  </button>
                  <span className="w-0">{formik.values.maxGuestCount}</span>
                  <button
                    disabled={isSubmitting}
                    type="button"
                    onClick={() => handleIncrement("maxGuestCount")}
                  >
                    <CiCirclePlus size={25} />
                  </button>
                </div>
                <div className="flex flex-row justify-between w-full p-3 border-2 rounded-md">
                  <span>Bedrooms:</span>
                  <div className="w-0 md:w-96" />
                  <button
                    disabled={isSubmitting}
                    type="button"
                    onClick={() => handleDecrement("bedroomCount")}
                  >
                    <CiCircleMinus size={25} />
                  </button>
                  <span className="w-0">{formik.values.bedroomCount}</span>
                  <button
                    disabled={isSubmitting}
                    type="button"
                    onClick={() => handleIncrement("bedroomCount")}
                  >
                    <CiCirclePlus size={25} />
                  </button>
                </div>
                <div className="flex flex-row justify-between w-full p-3 border-2 rounded-md">
                  <span className="pr-4">Beds:</span>
                  <div className="w-7 md:w-96" />
                  <button
                    disabled={isSubmitting}
                    type="button"
                    onClick={() => handleDecrement("bedCount")}
                  >
                    <CiCircleMinus size={25} />
                  </button>
                  <span className="w-0">{formik.values.bedCount}</span>
                  <button
                    disabled={isSubmitting}
                    type="button"
                    onClick={() => handleIncrement("bedCount")}
                  >
                    <CiCirclePlus size={25} />
                  </button>
                </div>
                <div className="flex flex-row justify-between w-full p-3 border-2 rounded-md">
                  <span>Bathrooms:</span>
                  <div className="w-0 md:w-96" />
                  <button
                    disabled={isSubmitting}
                    type="button"
                    onClick={() => handleDecrement("bathroomCount")}
                  >
                    <CiCircleMinus size={25} />
                  </button>
                  <span className="w-0">{formik.values.bathroomCount}</span>
                  <button
                    disabled={isSubmitting}
                    type="button"
                    onClick={() => handleIncrement("bathroomCount")}
                  >
                    <CiCirclePlus size={25} />
                  </button>
                </div>
              </div>
            </div>
            {/* PROERTY AMENITIES */}
            <div className="flex flex-col border-b-2 p-9">
              <CreateCategoryAmenities
                disabled={isSubmitting}
                onUpdateFormData={handleInputChange}
                onAmenitiesChange={handleAmenitiesChange}
              />
              {formik.touched.propertyAmenities &&
              formik.errors.propertyAmenities ? (
                <div className="text-sm text-red-600">
                  {formik.errors.propertyAmenities}
                </div>
              ) : null}
            </div>
            {/* PROPERTY DESCRIPTION */}
            <div className="flex flex-col border-b-2 p-9">
              <label htmlFor="DESCRIPTION" className="text-lg font-medium">
                Tell us more about your property
              </label>
              <textarea
                name="description"
                id="description"
                cols="30"
                rows="3"
                disabled={isSubmitting}
                value={formik.values.description}
                onChange={formik.handleChange}
                className="w-full p-4 text-xl border border-gray-400 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary"
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="text-sm text-red-600">
                  {formik.errors.description}
                </div>
              ) : null}
            </div>
            {/* PROPERTY RULES */}
            <div className="flex flex-col border-b-2 p-9">
              <Input
                type="text"
                label="Does your property have a specific rule?"
                id="propertyRules"
                disabled={isSubmitting}
                name="propertyRules"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setShowRules(true);
                    const newItem = e.target.value.trim();
                    if (newItem) {
                      formik.setFieldValue("propertyRules", [
                        ...formik.values.propertyRules,
                        newItem,
                      ]);
                      e.target.value = "";
                    }
                  }
                }}
              />
              {formik.touched.propertyRules && formik.errors.propertyRules ? (
                <div className="text-sm text-red-600">
                  {formik.errors.propertyRules}
                </div>
              ) : null}
              {showRules && (
                <div className="p-3 mt-3 border-2 rounded-md border-neutral-500">
                  <ul className="pl-6 mt-2 list-disc">
                    {formik.values.propertyRules.map((rule, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between"
                      >
                        {rule}
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() => {
                            const updatedRules =
                              formik.values.propertyRules.filter(
                                (_, i) => i !== index
                              );
                            formik.setFieldValue("propertyRules", updatedRules);
                          }}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {/* PROPERTY PRICE */}
            <div className="flex flex-col border-b-2 p-9">
              <Input
                disabled={isSubmitting}
                className={"appearance-none"}
                id="price"
                name="price"
                label="Price /night (IDR)"
                type="number"
                onChange={(value) => handleInputChange("price", value)}
              />
              {formik.touched.price && formik.errors.price ? (
                <div className="text-sm text-red-600">
                  {formik.errors.price}
                </div>
              ) : null}
            </div>
            <button
              className={`w-full p-4 text-white rounded-md bg-primary ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }}`}
              type="submit"
            >
              Create new property
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default CreateProperty;
