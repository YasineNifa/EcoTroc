import React, { useState, useEffect, useContext } from "react";
import apiClient from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { useSnackbar } from "notistack";
import ProfileDisplay from "./ProfileDisplay";
import ProfileForm from "./ProfileForm";

const ProfilePage = () => {
  const {
    user,
    profile: contextProfile,
    setProfile: setContextProfile,
  } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (contextProfile) {
      setLoading(false);
    } else {
      setLoading(false);
      setError("Could not load profile data.");
    }
  }, [contextProfile]);

  const handleProfileUpdate = async (bio, avatarFile) => {
    setError(null);
    const formData = new FormData();
    formData.append("bio", bio);
    if (avatarFile) {
      formData.append("image", avatarFile);
    }

    try {
      const response = await apiClient.patch("/profile/me/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setContextProfile(response.data);
      enqueueSnackbar("Profile updated successfully!", { variant: "success" });
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      enqueueSnackbar("Failed to update profile.", { variant: "error" });
      console.error(err.response?.data);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!contextProfile || !user) {
    return (
      <div className="text-center mt-10 text-gray-500">
        <p>Could not load user profile. Please try logging in again.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
        <ProfileDisplay user={user} profile={contextProfile} />
        <hr className="my-8" />
        <ProfileForm
          initialBio={contextProfile.bio}
          onSubmit={handleProfileUpdate}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
