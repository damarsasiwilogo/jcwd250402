import React, { useState, createContext, useContext, useEffect } from "react";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { RiMore2Fill } from "react-icons/ri";
import logo from "../asset/Logo-Black.svg";
import api from "../api";
import { useDispatch } from "react-redux";
import { logout } from "./slice/authSlices";

const SidebarContext = createContext();

export function Sidebar({
  children,
  onMenuItemClick,
  isExpanded,
  toggleSidebar,
}) {
  const dispatch = useDispatch();
  const [fullName, setFullname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());

    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href = "/";
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/user/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          const { fullname, email, profilePicture } = response.data.userInfo;
          setFullname(fullname);
          setUserEmail(email);
          setProfilePicture(profilePicture);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [token]);

  const defaultAvatar =
    "https://upload.wikimedia.org/wikipedia/commons/9/9f/Pessoa_Neutra.svg";

  const profilePictureSrc = profilePicture
    ? `http://localhost:8000/api/profile-picture/${profilePicture}`
    : defaultAvatar;

  // Update isSidebarExpanded based on viewport width
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarExpanded(window.innerWidth >= 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <aside className="h-screen">
      <nav className="flex flex-col h-full gap-4 bg-white border-r shadow-sm">
        <div className="flex items-center justify-between p-4 pb-2">
          {isUserMenuOpen && (
            <div className="absolute right-0 z-10 w-40 mr-2 bg-white border-2 rounded-lg shadow-md top-16">
              <button
                onClick={() => {
                  onMenuItemClick("editProfile");
                  setIsUserMenuOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  logoutHandler();
                  setIsUserMenuOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
              >
                Log Out
              </button>
            </div>
          )}
          <div className="flex p-3 border-0 rounded-lg md:border-2">
            <img
              src={profilePictureSrc}
              alt=""
              className="w-10 h-10 rounded-full"
            />
            <div
              className={`
              flex justify-between items-center relative
              overflow-hidden transition-all ${
                isSidebarExpanded ? "w-40 ml-3" : "w-0"
              }
          `}
            >
              <div className="leading-4">
                <h4 className="">{fullName}</h4>
                <span className="text-xs text-neutral-400">{userEmail}</span>
              </div>
              <button
                onClick={() => {
                  setIsUserMenuOpen((current) => !current);
                }}
              >
                <RiMore2Fill size={20} />
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              setIsSidebarExpanded((current) => !current);
              toggleSidebar();
            }}
            className="relative p-1 rounded-lg left-7 top-2 bg-gray-50 hover:bg-gray-100"
          >
            {isSidebarExpanded ? (
              <FaChevronCircleLeft />
            ) : (
              <FaChevronCircleRight />
            )}
          </button>
        </div>

        <SidebarContext.Provider value={{ isSidebarExpanded, isExpanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="flex items-center justify-center">
          <a href="/">
            <img
              src={logo}
              width={120}
              height={120}
              className={`overflow-hidden transition-all mb-8 cursor-pointer ml-[25px]
          ${isSidebarExpanded ? "" : "w-0"}
          `}
              alt=""
            />
          </a>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert, onMenuItemClick }) {
  const { isSidebarExpanded } = useContext(SidebarContext);
  return (
    <li
      onClick={() => onMenuItemClick(text)}
      className={`relative flex items-center py-4 px-3 my-1 font-medium rounded-md cursor-pointer  group ${
        active
          ? "bg-primary text-white"
          : "hover:bg-primary hover:text-white text-black"
      }`}
    >
      {icon}
      <span
        className={`
      overflow-hidden transition-all ${isSidebarExpanded ? "w-40 ml-3" : "w-0"}
      `}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-w w-2 h-2 rounded bg-indigo-400
        ${isSidebarExpanded ? "" : "top-2"}`}
        />
      )}

      {!isSidebarExpanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-primary text-white-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
