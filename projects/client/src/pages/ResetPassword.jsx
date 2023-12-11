import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api.js";
import { toast } from "sonner";
import logo from "../asset/Logo-Black.svg";
import { useDisclosure } from "@mantine/hooks";
import { LoadingOverlay, Box } from "@mantine/core";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [visible, { toggle }] = useDisclosure(false);
  const { token } = useParams();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setResetMessage("Passwords do not match");
      return;
    } else if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    } else {
      try {
        setIsloading(true);
        const response = await api.patch(`/auth/reset-password/${token}`, {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        });

        const data = await response.data;

        if (response.status === 200) {
          toast.success("Password Successfully Changed");
          localStorage.clear();
          navigate("/");
        } else {
          toast.error(`Error: ${data.message}`);
        }
      } catch (error) {
        setIsloading(false);
        toast.error("Error Please Try Again Later");
        console.error("Error:", error);
      } finally {
        setIsloading(false);
      }
    }
  };

  return (
    <Box pos={"relative"}>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <section className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center justify-center w-1/2 bg-white border-2 rounded-lg shadow-xl p-14 ">
          <div className="">
            <img
              src={logo}
              alt="logo"
              className="cursor-pointer h-[70px] w-[160px] ml-[25px]"
            />
          </div>
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleResetPassword}
          >
            <div className="w-full">
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block max-w-full p-2.5"
                placeholder="New Password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="w-full">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block max-w-full p-2.5"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              onClick={toggle}
              className="w-full text-[#FAFAFA] bg-primary hover:bg-primary/70 hover-bg-opacity-[80%] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-1"
            >
              Reset Password
            </button>
            {resetMessage && <div className="text-red-500">{resetMessage}</div>}
          </form>
        </div>
      </section>
    </Box>
  );
}
