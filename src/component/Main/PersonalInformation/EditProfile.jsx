import React, { useState, useEffect } from "react";

const EditProfile = ({ profile, onUpdateProfile, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  // Profile data load hole form fill kore dibe
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        phone: profile?.phone || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Parent component এর handler call করবে
    onUpdateProfile(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e91e63]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e91e63]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Email</label>
        <input
          type="email"
          value={profile?.email || ""}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Contact No</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e91e63]"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#e91e63] text-white py-2 rounded-lg hover:bg-pink-600 transition-all font-semibold mt-4 disabled:opacity-50"
      >
        {isLoading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
};

export default EditProfile;
