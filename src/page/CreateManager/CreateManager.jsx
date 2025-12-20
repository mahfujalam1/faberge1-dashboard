import React, { useState, useRef } from "react";
import {
  UploadOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Button } from "antd"; // Import the Button component from Ant Design

const CreateManager = ({ onSubmit, createLoading }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    managerId: "",
    phone: "",
    password: "",
    confirmPassword: "",
    managerProfileImage: "",
  });

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear password error when user types
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFormData({ ...formData, profileImage: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Password matching validation
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    // Password length validation
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long!");
      return;
    }

    // Create FormData object for submission
    const submitData = new FormData();

    // Append all text fields
    submitData.append("firstName", formData.firstName);
    submitData.append("lastName", formData.lastName);
    submitData.append("address", formData.address);
    submitData.append("city", formData.city);
    submitData.append("state", formData.state);
    submitData.append("zip", formData.zip);
    submitData.append("email", formData.email);
    submitData.append("managerId", formData.managerId);
    submitData.append("phone", formData.phone);
    submitData.append("password", formData.password);

    // Append profile image if exists
    if (formData.profileImage) {
      submitData.append("managerProfileImage", formData.profileImage);
    }

    // Call the onSubmit prop with the FormData
    onSubmit(submitData);
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">
        Create Manager
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e91e63]"
              placeholder="First Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e91e63]"
              placeholder="Last Name"
              required
            />
          </div>
        </div>

        {/* Address & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e91e63]"
              placeholder="Enter address"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e91e63]"
              placeholder="City"
              required
            />
          </div>
        </div>

        {/* State & Zip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e91e63]"
              placeholder="State"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zip Code
            </label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e91e63]"
              placeholder="Zip Code"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e91e63]"
            placeholder="example@email.com"
            required
          />
        </div>

        {/* Manager ID & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Create ID#
            </label>
            <input
              type="text"
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e91e63]"
              placeholder="252 441 654"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e91e63]"
              placeholder="+1 234 567 8901"
              required
            />
          </div>
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-[#e91e63]"
              placeholder="Enter password"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[35px] cursor-pointer text-gray-500 hover:text-[#e91e63]"
            >
              {showPassword ? (
                <EyeTwoTone twoToneColor="#e91e63" />
              ) : (
                <EyeInvisibleOutlined />
              )}
            </span>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-[#e91e63]"
              placeholder="Confirm password"
              required
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[35px] cursor-pointer text-gray-500 hover:text-[#e91e63]"
            >
              {showConfirmPassword ? (
                <EyeTwoTone twoToneColor="#e91e63" />
              ) : (
                <EyeInvisibleOutlined />
              )}
            </span>
          </div>
        </div>

        {/* Password Error Message */}
        {passwordError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
            {passwordError}
          </div>
        )}

        {/* Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <div
            onClick={handleFileClick}
            className="border-2 border-dashed border-pink-200 rounded-lg h-36 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-50 transition-all"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-32 w-32 rounded-full object-cover"
              />
            ) : (
              <>
                <UploadOutlined className="text-2xl text-[#e91e63] mb-2" />
                <p className="text-sm text-gray-500">Upload Image</p>
              </>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="primary"
          htmlType="submit"
          className="w-full py-2.5 rounded-lg font-semibold mt-4 transition-all bg-[#ff3679] hover:bg-[#ff307c] text-white"
          loading={createLoading}
          style={{
            backgroundColor: "#ff3679", // your primary button color
            borderColor: "#ff3679", // border color for the button
          }}
        >
          Create Manager
        </Button>
      </form>
    </div>
  );
};

export default CreateManager;
