import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik, Formik, Form } from "formik";
import * as Yup from "yup";
import yupPassword from "yup-password";
import { toast } from "sonner";

import api from "../../api";
import useLoginModal from "../hooks/useLoginModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import { useDispatch } from "react-redux";
import { login, isTenant } from "../slice/authSlices";

yupPassword(Yup);

const LoginModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const location = useLocation();
  const { openLoginModal } = location.state || {};
  const [formData, setFormData] = useState({
    user_identity: "",
    password: "",
    email: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (openLoginModal) {
      loginModal.onOpen();
    }
  });

  const loginSchema = Yup.object().shape({
    user_identity: Yup.string()
      .required("Username/Email can't be empty")
      .min(6, "Minimum characters is 6"),
    password: Yup.string().required("Password can't be empty"),
    email: Yup.string().email("Please enter a valid email address"),
  });

  const formik = useFormik({
    onSubmit: (values) => {
      const { user_identity, password } = values;
      loginUser(user_identity, password);
    },
  });

  const formikReset = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      const { email } = values;
      loginUser(email);
    },
  });

  const loginUser = async (user_identity, password) => {
    try {
      const response = await api.post("/auth/login", {
        user_identity,
        password,
      });
      if (response.status === 200) {
        toast.info("Welcome back! Successfully logged in!");
        const userData = response.data;
        const token = userData.token;
        const role = userData.role;

        dispatch(login({ token: token }));
        console.log();
        if (role === "tenant") {
          loginModal.onClose();
          navigate("/tenant/dashboard");
          dispatch(isTenant({ isTenant: true }));
          setIsLoading(false);
        } else if (role === "user") {
          loginModal.onClose();
          navigate("/user");
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Invalid Username/Email or Password.");
      console.error("Error:", error);
    }
  };

  const handleForgotPassword = async (email) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", {
        email,
      });
      if (response.status === 200) {
        toast.success("Reset password link has been sent to your email.");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to send reset password link.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="Login to your account!" />
      <Formik
        initialValues={{
          user_identity: "",
          password: "",
        }}
        validationSchema={loginSchema}
        onSubmit={formik.handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4 md:space-y-2">
            <Input
              id="user_identity"
              name="user_identity"
              label="Username or Email"
              type="text"
              disabled={isLoading}
              required={true}
              onChange={(value) => handleInputChange("user_identity", value)}
            />
            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              disabled={isLoading}
              required={true}
              onChange={(value) => handleInputChange("password", value)}
            />
          </Form>
        )}
      </Formik>

      <div>
        <button
          onClick={() => setIsForgotPassword(true)}
          className="text-xs text-neutral-500 hover:text-black"
        >
          <span>forgot password?</span>
        </button>
      </div>
    </div>
  );

  const forgotPasswordBody = (
    <div className="flex flex-col gap-4">
      <Heading subtitle="Uh-oh it seems you have a problem signing-in" />
      <Formik
        initialValues={formikReset.initialValues}
        validationSchema={loginSchema}
        onSubmit={formikReset.handleSubmit}
      >
        {() => (
          <Form>
            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              disabled={isLoading}
              required
              onChange={(value) => handleInputChange("email", value)}
            />
          </Form>
        )}
      </Formik>
      <div>
        <button
          onClick={() => setIsForgotPassword(false)}
          className="text-xs text-neutral-500 hover:text-black"
        >
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );

  const modalBody = isForgotPassword ? forgotPasswordBody : bodyContent;
  const submitAction = isForgotPassword
    ? () => handleForgotPassword(formData.email)
    : () => loginUser(formData.user_identity, formData.password);

  return (
    <>
      <Modal
        disabled={isLoading}
        isOpen={loginModal.isOpen}
        onClose={() => {
          loginModal.onClose();
          setIsForgotPassword(false);
          // window.location.reload();
        }}
        title={isForgotPassword ? "Forgot Password" : "Login"}
        actionLabel={isForgotPassword ? "Send Reset Password Link" : "Sign In"}
        body={modalBody}
        onSubmit={submitAction}
      />
    </>
  );
};

export default LoginModal;
