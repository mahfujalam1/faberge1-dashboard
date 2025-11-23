import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useResetPasswordMutation } from "../../../redux/features/auth/authApi";

const NewPassword = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [resetPassword] = useResetPasswordMutation()

  const [passwords, setPasswords] = useState({
    new: "",
    confirm: "",
  });

  const [visible, setVisible] = useState({
    new: false,
    confirm: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setError(""); // clear error when typing
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwords.new !== passwords.confirm) {
      setError("New password and confirm password do not match!");
      return;
    }

    console.log("Password updated for:", email, passwords);
    navigate("/auth/sign-in");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md w-full max-w-lg p-10 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo/logo.png"
            alt="IHBS Logo"
            className="w-40 h-40 object-contain mb-2"
          />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Set new password
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {["current", "new", "confirm"].map((type) => (
            <div key={type}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {type === "confirm"
                  ? "Confirm New Password"
                  : `${type} Password`}
              </label>
              <div className="relative">
                <input
                  type={visible[type] ? "text" : "password"}
                  name={type}
                  value={passwords[type]}
                  onChange={handleChange}
                  placeholder={
                    type === "current"
                      ? "Enter your current password"
                      : type === "new"
                      ? "Enter your new password"
                      : "Confirm your new password"
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-black pr-10"
                  required
                />
                <span
                  className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                  onClick={() =>
                    setVisible({ ...visible, [type]: !visible[type] })
                  }
                >
                  {visible[type] ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                </span>
              </div>
            </div>
          ))}

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm font-medium text-center -mt-2">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition-all"
          >
            Save Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
