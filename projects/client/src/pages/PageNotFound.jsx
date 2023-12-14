import React from "react";
import logo from "../asset/Logo-Black.svg";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  document.title = "Page Not Found";
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center bg-white rounded-lg p-14">
        <div className="items-center justify-center mb-4">
          <span className="mx-2 text-5xl font-bold text-black">4</span>
          <span className="mx-2 text-5xl font-bold text-primary">0</span>
          <span className="mx-2 text-5xl font-bold text-black">4</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Page Not Found</h1>
          <p className="text-lg">
            The page you are looking for does not exist.
          </p>
          <img
            className="mt-20 cursor-pointer"
            src={logo}
            alt="logo"
            width={120}
            height={120}
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
