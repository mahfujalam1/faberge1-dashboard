import React, { useState } from "react";
import { useChangePasswordMutation } from "../../../redux/features/profile/profileApi";
import { toast } from "sonner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ChangePassword = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: New password and confirm password match kina check
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    try {
      // confirmPassword bad diye backend e pathabo
      const { confirmPassword, ...passwordData } = passwords;

      const res = await changePassword(passwordData);

      if (res?.data) {
        toast.success(res?.data?.message || "Password changed successfully!");
        // Form reset
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(res?.error?.data?.message || "Failed to change password");
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.message || "Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.currentPassword ? "text" : "password"}
            name="currentPassword"
            placeholder="Current Password..."
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-[#e91e63]"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("currentPassword")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#e91e63]"
          >
            {showPasswords.currentPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">New Password</label>
        <div className="relative">
          <input
            type={showPasswords.newPassword ? "text" : "password"}
            name="newPassword"
            placeholder="New Password..."
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-[#e91e63]"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("newPassword")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#e91e63]"
          >
            {showPasswords.newPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.confirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password..."
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-[#e91e63]"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("confirmPassword")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#e91e63]"
          >
            {showPasswords.confirmPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#e91e63] text-white py-2 rounded-lg hover:bg-pink-600 transition-all font-semibold mt-4 disabled:opacity-50"
      >
        {isLoading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

export default ChangePassword;
