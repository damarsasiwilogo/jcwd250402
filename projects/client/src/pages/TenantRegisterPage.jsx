import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import { UploadPhoto } from "../components";
import "react-datepicker/dist/react-datepicker.css";
import Input from "../components/inputs/Input";
import { toast } from "sonner";
import { Formik, Form, useFormik } from "formik";
import logo from "../asset/Logo-Black.svg";
import * as Yup from "yup";

// not yet functional
const TenantRegisterPage = () => {
  const [step, setStep] = useState(1);
  const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    gender: "",
    dateofbirth: "",
    profilePicture: null,
  });

  const validationSchema = Yup.object({
    fullname: Yup.string().required("Full Name is required"),
    email: Yup.string()
      .email("Email is not valid")
      .required("Email is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    gender: Yup.string()
      .required("Gender is required")
      .oneOf(["male", "female", "other"], "Invalid gender selection"),
    dateofbirth: Yup.date()
      .required("Date of birth is required")
      .test("is-adult", "You must be at least 18 years old", (value) => {
        return (
          moment().diff(moment(value), "years") >= 18 ||
          toast.error("You must be at least 18 years old")
        );
      }),
    profilePicture: Yup.mixed()
      .required("Profile Picture is required")
      .test("fileSize", "File is too large", (value) => {
        return !value || (value && value.size <= 1024 * 1024);
      })
      .test("fileType", "Invalid file type", (value) => {
        return (
          !value ||
          (value &&
            ["image/gif", "image/png", "image/jpeg"].includes(value.type))
        );
      }),
  });

  const initialValues = {
    fullname: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    gender: "",
    dateofbirth: "",
    profilePicture: null,
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleNext = () => {
    //tambah validasi sebelum lanjut ke step berikutnya
    // validationSchema
    //   .validate(values, { abortEarly: false }) // Validate all fields, not just one
    //   .then(() => {
    //     // If validation passes, proceed to next step
    //   })
    nextStep();
    // .catch((errors) => {
    //   // If validation fails, set errors to display
    //   const formErrors = {};
    //   errors.inner.forEach((error) => {
    //     formErrors[error.path] = error.message;
    //   });
    //   setErrors(formErrors);
    // });
  };

  const handlePrev = () => {
    prevStep();
  };

  const handleSubmit = () => {
    // Add submit logic here
  };

  const handleFileChange = (files) => {
    // Assuming you want to store only the first file selected
    const profilePicture = files[0];

    setFormData((prevData) => ({
      ...prevData,
      profilePicture,
    }));
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    // onSubmit,
  });

  const progressPercentage = ((step - 1) / 3) * 100;

  useEffect(() => {
    if (!formData.fullname) {
      setIsDisabled(true);
      return;
    }
    setIsDisabled(false);
  }, [formData.fullname, setIsDisabled]);

  return (
    <div>
      <div className="flex p-0 mt-7 mx-14">
        <img src={logo} alt="logo" width={220} height={220} />
      </div>
      <div className="flex flex-col items-center justify-center h-max">
        <Formik
          initialValues={formik.initialValues}
          validationSchema={formik.validationSchema}
          onSubmit={formik.handleSubmit}
        >
          <Form className="flex flex-col h-[40vh] w-[40vw] md:mt-[120px] p-12 ">
            {step === 1 && (
              <>
                <h1 className="mb-4 text-2xl">
                  Let's start with something easy
                </h1>
                {/* <label htmlFor="name" className="mb-2">
              Name
            </label> */}
                <Input
                  label={"Tell us your name"}
                  id="name"
                  type="text"
                  placeholder="Tell us your name"
                  value={formData.fullname}
                  onChange={(e) => handleChange("fullname", e)}
                  className="w-full px-3 py-2 mb-4 border-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-400"
                  required={true}
                />
                {/* <Dropzone label={"What you look like"} /> */}
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="mb-4 text-2xl">
                  Something you'll need to log in
                </h1>
                <Input
                  label={"Pick a username"}
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="w-full px-3 py-2 mb-4 border-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-400"
                  required={true}
                />
                <Input
                  label={"What's your email?"}
                  id="email"
                  type="text"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-3 py-2 mb-4 border-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-400"
                  required={true}
                />
                <Input
                  label={"Pick your secret key"}
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full px-3 py-2 mb-4 border-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-400"
                  required={true}
                />
                <Input
                  label={"Confirm your secret key"}
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className="w-full px-3 py-2 mb-4 border-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-400"
                  required={true}
                />
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <h1 className="mb-4 text-2xl">About You</h1>
                    <label htmlFor="dateofbirth">Date of Birth</label>
                    <DatePicker
                      id="dob"
                      name="dateofbirth"
                      onChange={() => {}}
                      onBlur={() => {}}
                      selected={new Date()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-400"
                      disabled={false} // Pass a boolean value
                    />
                  </div>
                  <div>
                    <label htmlFor="gender">Gender</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-400"
                      disabled={false}
                      required
                      onChange={() => {}}
                      onBlur={() => {}}
                      value={() => {}}
                      name="gender"
                    >
                      <option value="" disabled selected>
                        Select
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Rather not to say</option>
                    </select>
                  </div>
                  <UploadPhoto
                    id="profilePicture"
                    name="profilePicture"
                    label="Profile Picture"
                    formik={formik}
                    field="profilePicture"
                    onChange={(value) => {
                      formik.setFieldValue("profilePicture", value);
                    }}
                  />
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h1 className="mb-4 text-2xl">Proof of Identification </h1>
                <UploadPhoto />
              </>
            )}
          </Form>
        </Formik>

        <div className="absolute bottom-0 left-0 w-full mb-4">
          <div className="h-2 mb-4 bg-gray-200 rounded">
            <div
              className="w-full h-full bg-black"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div>
            {step === 1 ? (
              <button
                className="px-6 py-2 mr-2 border-2 rounded-lg cursor-not-allowed text-neutral-500"
                disabled
                onClick={handlePrev}
              >
                Back
              </button>
            ) : (
              <button
                className="px-6 py-2 mr-2 border-2 rounded-lg text-neutral-500"
                onClick={handlePrev}
              >
                Back
              </button>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 right-0 mb-4 mr-4">
          <div>
            {step !== 4 ? (
              <button
                className="px-6 py-2 text-white rounded-lg bg-primary hover:bg-primary/70 disabled:bg-slate-500"
                onClick={handleNext}
                disabled={isDisabled}
              >
                Next
              </button>
            ) : (
              <button
                className="px-6 py-2 text-white rounded-lg bg-primary hover:bg-primary/70 "
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantRegisterPage;
