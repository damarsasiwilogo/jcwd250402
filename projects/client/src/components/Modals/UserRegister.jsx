import { useState } from "react";
import * as Yup from "yup";
import yupPassword from "yup-password";
import { toast } from "sonner";
import { Form, Formik, useFormik } from "formik";

import useUserRegister from "../hooks/useUserRegister"; // Register Slice
import useLoginModal from "../hooks/useLoginModal"; // Login Slice
import Heading from "../Heading";
import Input from "../inputs/Input";
import Modal from "./Modal";
import api from "../../api";
import LoginModal from "./LoginModal"; // Login Component
import { useNavigate } from "react-router-dom";
yupPassword(Yup);

const UseRegisterModal = () => {
  const navigate = useNavigate();
  const UseRegisterModal = useUserRegister();
  const UseLoginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "user",
  });

  const registerSchema = Yup.object({
    fullname: Yup.string().required("Fullname is required"),
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
    phoneNumber: Yup.string().required("phoneNumber is required"),
  });

  const registerUser = async (fullname, email, password, phoneNumber, role) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", {
        fullname,
        email,
        password,
        phoneNumber,
        role: "user",
      });

      if (response.status === 200) {
        setIsLoading(false);
        toast.success("You're Registered Successfully as a User");
        UseRegisterModal.onClose();
        navigate("/");
      }
    } catch (err) {
      setIsLoading(false);
      toast.error("Register failed. Please check your credentials.");
      console.error("Error:", err);
    }
  };
  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      phoneNumber: "",
      role: "user",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      const { fullname, email, password, phoneNumber, role } = values;
      registerUser(fullname, email, password, phoneNumber, role);
    },
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = () => {
    registerUser(
      formData.fullname,
      formData.email,
      formData.password,
      formData.phoneNumber
    );
  };

  const loginButton = () => {
    setIsRegistering(false);
    UseRegisterModal.onClose();
    UseLoginModal.onOpen();
  };

  const submitAction = () => {
    handleRegister();
    navigate("/");
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to Nginapp" subtitle="Lets create your account" />
      <Formik
        initialValues={formik.initialValues}
        validationSchema={registerSchema}
        onSubmit={formik.handleSubmit}
      >
        {() => (
          <Form>
            <Input
              id="fullname"
              name="fullname"
              label="Full Name"
              type="text"
              disabled={isLoading}
              required
              onChange={(value) => handleInputChange("fullname", value)}
            />
            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              disabled={isLoading}
              required
              onChange={(value) => handleInputChange("email", value)}
            />
            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              disabled={isLoading}
              required
              onChange={(value) => handleInputChange("password", value)}
            />
            <Input
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              type="text"
              disabled={isLoading}
              required
              onChange={(value) => handleInputChange("phoneNumber", value)}
            />
          </Form>
        )}
      </Formik>

      <div className="flex flex-col items-start">
        <button
          onClick={loginButton}
          className="text-xs text-neutral-500 hover:text-black"
        >
          <span>Have an account? Sign In</span>
        </button>
        <button
          onClick={() => {
            navigate("/tenant/register");
            UseRegisterModal.onClose();
          }}
          className="text-xs text-neutral-500 hover:text-black"
        >
          <span>Become a Host? Sign Up here</span>
        </button>
      </div>
    </div>
  );
  // const openLoginModal = UseLoginModal.onOpen();

  // const modalBodyContent = isRegistering ? bodyContent ;

  return (
    <Modal
      disabled={isLoading}
      isOpen={UseRegisterModal.isOpen}
      onOpen={UseRegisterModal.onOpen}
      onClose={() => {
        setIsRegistering(true);
        UseLoginModal.onClose();
        // window.location.reload();
        UseRegisterModal.onClose();
      }}
      title="User Registration"
      actionLabel={isRegistering ? "Sign Up" : "Sign In"}
      onSubmit={submitAction}
      body={bodyContent}
    />
  );
};

export default UseRegisterModal;
