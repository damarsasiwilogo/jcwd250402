import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BiCalendar } from "react-icons/bi";
import { MdFavorite } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { AiOutlineMenu } from "react-icons/ai";
import useLoginModal from "../hooks/useLoginModal.js";
import useTenantRegister from "../hooks/useTenantRegister.js";
import useUserRegister from "../hooks/useUserRegister.js";
import { logout } from "../slice/authSlices.js";
import { useDispatch } from "react-redux";
import { Menu, Button, Text, Avatar } from "@mantine/core";
import { TbLogout } from "react-icons/tb";
import api from "../../api.js";
import { PiCloudMoonLight } from "react-icons/pi";

const UserMenu = () => {
  const dispatch = useDispatch();
  const loginModal = useLoginModal();
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState("");
  const [usersName, setUsersName] = useState("");
  const tenantRegister = useTenantRegister();
  const userRegister = useUserRegister();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTenant, setIsTenant] = useState(false);
  const [isUser, setIsUser] = useState(false);
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
          const { profilePicture, fullname } = response.data.userInfo;
          setProfilePicture(profilePicture);
          setUsersName(fullname);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  });

  useEffect(() => {
    const userIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(userIsLoggedIn);
    if (userIsLoggedIn) {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
      if (userRole === "tenant") {
        setIsTenant(true);
      } else if (userRole === "user") {
        setIsUser(true);
      }
    }
  }, []);

  const logOutHandler = () => {
    if (!isLoggedIn) {
      toast.error("You are not logged in");
      loginModal.onOpen();
      return;
    }
    dispatch(logout());
    toast.success("Successfully logged out! We'll miss you :(");
    window.location.reload();
  };

  const profilePictureSrc = profilePicture
    ? `http://localhost:8000/api/profile-picture/${profilePicture}`
    : "https://upload.wikimedia.org/wikipedia/commons/9/9f/Pessoa_Neutra.svg";
  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        {!isLoggedIn && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigate("/tenant");
            }}
            className="px-4 py-3 text-sm font-semibold transition rounded-full cursor-pointer md:block hover:bg-neutral-100"
          >
            Become a Host
          </div>
        )}
        {isTenant && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigate("/tenant/dashboard");
            }}
            className="px-4 py-3 text-sm font-semibold transition rounded-full cursor-pointer md:block hover:bg-neutral-100"
          >
            Tenant Dashboard
          </div>
        )}

        <Menu shadow="md" width={250} bg={"none"} p={0} withBorder>
          <Menu.Target>
            <Button style={{ color: "black", fontSize: 24 }}>
              <AiOutlineMenu />
            </Button>
          </Menu.Target>
          {isLoggedIn ? (
            <Menu.Dropdown>
              <Menu.Item
                onClick={() => navigate("/bookings")}
                leftSection={<BiCalendar size={18} />}
              >
                Bookings
              </Menu.Item>
              <Menu.Item leftSection={<MdFavorite size={18} />}>
                Favorite
              </Menu.Item>
              <Menu.Item
                onClick={() => navigate("/tenant")}
                leftSection={<PiCloudMoonLight size={18} />}
              >
                Become a Host
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<Avatar src={profilePictureSrc} />}>
                {usersName}
                <Text size={"xs"}>Profile Settings</Text>
              </Menu.Item>
              <Menu.Item
                leftSection={<TbLogout size={18} />}
                onClick={logOutHandler}
              >
                Log Out
              </Menu.Item>
            </Menu.Dropdown>
          ) : (
            <Menu.Dropdown>
              <Menu.Item onClick={loginModal.onOpen}>Login</Menu.Item>
              <Menu.Item onClick={userRegister.onOpen}>Register</Menu.Item>
            </Menu.Dropdown>
          )}
        </Menu>
      </div>
    </div>
  );
};

export default UserMenu;
