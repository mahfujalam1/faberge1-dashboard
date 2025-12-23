import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { EditOutlined } from "@ant-design/icons";
import {
  useGetMyProfileQuery,
  useUpdateUserMutation,
} from "../../../redux/features/profile/profileApi";
import { toast } from "sonner";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";

const ProfileForm = () => {
  const [activeTab, setActiveTab] = useState("edit");
  const { data: profile, refetch } = useGetMyProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateUserMutation();
  const [file, setFile] = useState(null); // Store the file here
  const [previewImage, setPreviewImage] = useState(""); // Preview the image
  const fileInputRef = useRef(null);

  // Set profile image preview when profile data loads
  useEffect(() => {
    if (profile?.uploadPhoto) {
      setPreviewImage(profile.uploadPhoto);
    }
  }, [profile]);

  // Handle profile update
  const handleUpdateProfile = async (formData) => {
    try {
      const data = new FormData();

      // Append user details
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("phone", formData.phone);

      // Append photo only if it's set (binary data)
      if (file) {
        data.append("managerProfileImage", file); // Append the actual file as binary data
      }

      const res = await updateProfile(data);

      if (res?.data) {
        toast.success(res?.data?.message || "Profile updated successfully!");
        refetch(); // Refresh the profile data
      } else {
        console.log(res?.error?.data?.message || "Failed to update profile");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  // Trigger file input click
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection and preview
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Store the selected file in state

      // Preview the selected image
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(imageUrl);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>
      </div>

      <div className="w-[400px] mx-auto">
        {/* Profile Header */}
        <div className="bg-white shadow-sm rounded-xl p-8 flex flex-col items-center mb-8 relative">
          <div className="relative">
            <img
              src={`${previewImage || import.meta.env.VITE_REACT_APP_BASE_URL}${
                profile?.uploadPhoto
              }`}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-pink-100"
            />

            {/* Edit Icon */}
            <div
              onClick={handleIconClick}
              className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow cursor-pointer hover:bg-pink-50 transition-all"
            >
              <EditOutlined className="text-[#e91e63] text-lg" />
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-3">
            {profile?.firstName + " " + profile?.lastName}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center border-b border-pink-100 mb-6">
          <button
            className={`px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === "edit"
                ? "text-[#e91e63] border-b-2 border-[#e91e63]"
                : "text-gray-500 hover:text-[#e91e63]"
            }`}
            onClick={() => setActiveTab("edit")}
          >
            Edit Profile
          </button>
          <button
            className={`px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === "password"
                ? "text-[#e91e63] border-b-2 border-[#e91e63]"
                : "text-gray-500 hover:text-[#e91e63]"
            }`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 w-full">
          <div className="max-w-lg mx-auto">
            {activeTab === "edit" ? (
              <EditProfile
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                isLoading={isLoading}
              />
            ) : (
              <ChangePassword />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
