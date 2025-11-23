import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useVerifyOtpMutation } from "../../../redux/features/auth/authApi";

const OtpVerify = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const [verifyOTP] = useVerifyOtpMutation()

  // handle otp input
  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus forward automatically
      if (value && index < otp.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  // handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify =async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length === 6) {
      await verifyOTP({email, code})
      navigate(`/auth/new-password/${encodeURIComponent(email)}`);
    } else {
      alert("Please enter all 6 digits!");
    }
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

        <h2 className="text-lg font-semibold text-gray-800 mb-2">Verify OTP</h2>
        <p className="text-sm text-gray-500 mb-6">
          Please check your email. We’ve sent a code to <b>{email}</b>
        </p>

        {/* OTP Inputs */}
        <form onSubmit={handleVerify}>
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                maxLength="1"
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:border-black"
              />
            ))}
          </div>

          <div className="text-sm text-gray-500 mb-4">
            Didn’t receive code?{" "}
            <button
              type="button"
              className="text-black font-medium hover:underline"
              onClick={() => console.log("🔁 Resend Code")}
            >
              Resend
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition-all"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerify;
