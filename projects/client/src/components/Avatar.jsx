import React, { useEffect, useState } from "react";
import api from "../api.js";

const Avatar = ({ width, height }) => {
  const [profilePicture, setProfilePicture] = useState(null);
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
          const { profilePicture } = response.data.userInfo;
          setProfilePicture(profilePicture);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [token]);

  const profilePictureSrc = profilePicture
    ? `http://localhost:8000/api/profile-picture/${profilePicture}`
    : "https://upload.wikimedia.org/wikipedia/commons/9/9f/Pessoa_Neutra.svg";

  return (
    <img
      className="rounded-full "
      src={profilePictureSrc}
      alt="avatar"
      height={height}
      width={width}
    />
  );
};

export default Avatar;
