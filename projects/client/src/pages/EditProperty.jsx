import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import CountrySelect from "../components/inputs/CountrySelect";
import ProvinceSelect from "../components/inputs/ProvinceSelect";
import CitySelect from "../components/inputs/CitySelect";
import "react-autocomplete-input/dist/bundle.css";

const EditProperty = () => {
  const navigate = useNavigate();
  const [images] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const [propertiesData, setPropertiesData] = useState([]);

  const fetchPropertyData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/property/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;

      if (response.status === 200) {
        const propertyRules = data.Property.propertyRules.map(
          (rule) => rule.rule
        );

        setPropertiesData({
          ...data.Property,
          propertyRules: propertyRules,
        });
      }
    } catch (error) {
      console.error("Error fetching properties:", error.message);
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, []);

  const formik = useFormik({
    initialValues: {
      propertyName: propertiesData.name || "",
      description: propertiesData.description || "",
      price: propertiesData.price || 0,
      bedCount: propertiesData.bedCount || 0,
      bedroomCount: propertiesData.bedroomCount || 0,
      maxGuestCount: propertiesData.maxGuestCount || 0,
      bathroomCount: propertiesData.bathroomCount || 0,
      propertyType: propertiesData.categories?.[0]?.propertyType || "",
      district: propertiesData.categories?.[0]?.district || "",
      city: propertiesData.categories?.[0]?.city || "",
      province: propertiesData.categories?.[0]?.province || "",
      country: propertiesData.categories?.[0]?.country || "",
      streetAddress: propertiesData.categories?.[0]?.streetAddress || "",
      postalCode: propertiesData.categories?.[0]?.postalCode || "",
      propertyAmenities: propertiesData.amenities || [],
      propertyRules: propertiesData.propertyRules || [],
      images: propertiesData.images || [[]],
    },

    enableReinitialize: true,
    onSubmit: async () => {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const isTenant = localStorage.getItem("isTenant");
      if (isTenant === "false" || isTenant === "null") {
        toast.error("Only tenants can edit properties!");
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
      formData.append("city", formik.values.city);
      formData.append("province", formik.values.province.label);
      formData.append("country", formik.values.country.label);
      formData.append("streetAddress", formik.values.streetAddress);
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
        const response = await api.patch(`/property/edit/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          navigate("/tenant/dashboard");
          toast.success("Property edited successfully");
          setIsSubmitting(false);
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

  document.title = `Edit ${propertiesData.name}`;
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
            </div>
            {/* PROPERTY TYPE */}
            <div>
              <CreatePropertyType
                value={formik.values.propertyType}
                setValue={formik.handleChange}
                disabled={isSubmitting}
                selectedValue={
                  propertiesData.categories?.[0]?.propertyType || ""
                }
              />
            </div>
            {/* PROPERTY LOCATION */}
            <h1 className="p-4 text-2xl">Property Location</h1>
            <div className="flex flex-col border-b-2 p-9 gap-y-3">
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
              <label
                htmlFor="property_location"
                className="text-xl font-medium"
              >
                District
              </label>
              <input
                name="district"
                type="text"
                className={`w-full p-4 text-xl border border-gray-400 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary
                ${isSubmitting ? "bg-gray-200" : "bg-white"}}`}
                value={formik.values.district}
                onChange={formik.handleChange}
                disabled={isSubmitting}
              />
              <label
                htmlFor="property_location"
                className="text-xl font-medium"
              >
                Street Address
              </label>
              <input
                name="province"
                type="text"
                placeholder="eg. Shinjuku"
                className={`w-full p-4 text-xl border border-gray-400 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary
                ${isSubmitting ? "bg-gray-200" : "bg-white"}}`}
                value={formik.values.streetAddress}
                onChange={formik.handleChange}
                disabled={isSubmitting}
              />
              <label
                htmlFor="property_location"
                className="text-xl font-medium"
              >
                Postal Code
              </label>
              <input
                name="province"
                type="text"
                placeholder="eg. Shinjuku"
                className={`w-full p-4 text-xl border border-gray-400 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary
                ${isSubmitting ? "bg-gray-200" : "bg-white"}}`}
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                disabled={isSubmitting}
              />
            </div>
            {/* PROPERTY IMAGES */}
            <label htmlFor="property_images" className="text-lg font-medium ">
              Upload your property images
            </label>
            <div className="flex flex-row items-center justify-center border-b-2">
              <div className="flex flex-row items-center justify-center overflow-y-scroll gap-x-2">
                {propertiesData.propertyImages &&
                  propertiesData.propertyImages.map((imageObj, index) => (
                    <div
                      key={index}
                      className="col-span-5 row-span-1 overflow-y-scroll bg-gray-200 md:col-span-3 md:row-span-2 lg:col-span-3 lg:row-span-2 xl:col-span-3 xl:row-span-2 2xl:col-span-3 2xl:row-span-2 "
                    >
                      <img
                        src={`http://localhost:8000/api/property-asset/${imageObj.image}`}
                        alt={`Property ${index + 1}`}
                        className="object-cover w-full h-full "
                      />
                    </div>
                  ))}
                <ImageUploader
                  images={images}
                  disabled={isSubmitting}
                  onUpdateFormData={handleImageUpdate}
                />
              </div>
            </div>
            <div className="p-9"></div>
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
                selectedAmenities={propertiesData.amenities || []}
              />
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
                    const newItem = e.target.value.trim();
                    if (newItem) {
                      const newIndex = formik.values.propertyRules.length;
                      formik.setFieldValue("propertyRules", [
                        ...formik.values.propertyRules,
                        newItem,
                      ]);
                      e.target.value = "";
                    }
                  }
                }}
              />
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
                              (r, i) => i !== index
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
            </div>

            {/* PROPERTY PRICE */}
            <div className="flex flex-col border-b-2 p-9">
              <label
                htmlFor="property_location"
                className="text-xl font-medium"
              >
                Price /night (IDR)
              </label>
              <input
                name="price"
                type="number"
                placeholder="eg. Shinjuku"
                className={`w-full p-4 text-xl border border-gray-400 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary
                ${isSubmitting ? "bg-gray-200" : "bg-white"}}`}
                value={formik.values.price}
                onChange={formik.handleChange}
                disabled={isSubmitting}
              />
            </div>
            <button
              className="w-full p-4 text-white rounded-md bg-primary"
              type="submit"
            >
              Update
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default EditProperty;
