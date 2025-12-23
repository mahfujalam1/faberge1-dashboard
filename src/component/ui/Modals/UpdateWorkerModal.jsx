import { useRef, useState, useEffect } from "react";
import { Modal } from "antd";
import {
  UploadOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useUpdateWorkerMutation } from "../../../redux/features/worker/worker";
import { toast } from "sonner";

const UpdateWorkerModal = ({ isOpen, onClose, workerData }) => {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [updateWorker, { isLoading }] = useUpdateWorkerMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    title: "",
    workerId: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [imageError, setImageError] = useState("");

  // Populate form with existing worker data
  useEffect(() => {
    if (workerData && isOpen) {
      setFormData({
        firstName: workerData.firstName || "",
        lastName: workerData.lastName || "",
        address: workerData.address || "",
        city: workerData.city || "",
        state: workerData.state || "",
        zipCode: workerData.zipCode || "",
        title: workerData.title || "",
        workerId: workerData.workerId || "",
        phone: workerData.phone || "",
        email: workerData.email || "",
        password: "",
        confirmPassword: "",
      });

      // Set existing image
      if (workerData.uploadPhoto) {
        setImagePreview(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}${workerData.uploadPhoto}`
        );
      }

      // Reset image file and errors when modal opens
      setImageFile(null);
      setImageError("");
      setPasswordError("");
    }
  }, [workerData, isOpen]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear password error when user types
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setPasswordError("");
    }
  };

  // Handle image upload with 5MB size validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Clear previous errors
    setImageError("");

    if (file) {
      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        const errorMsg = "Only JPG, PNG, and GIF files are allowed";
        setImageError(errorMsg);
        toast.error(errorMsg);
        e.target.value = ""; // Reset file input
        return;
      }

      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);

      if (file.size > maxSize) {
        const errorMsg = `File size is ${fileSizeInMB}MB. Maximum allowed size is 5MB`;
        setImageError(errorMsg);
        toast.error(errorMsg);
        e.target.value = ""; // Reset file input
        return;
      }

      // Valid file - proceed with upload
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      toast.success("Image selected successfully");
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation (only if password is being changed)
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setPasswordError("Passwords do not match!");
        return;
      }

      if (formData.password.length < 6) {
        setPasswordError("Password must be at least 6 characters long!");
        return;
      }
    }

    // Create FormData instance
    const postData = new FormData();

    // Append all form fields (except password if empty)
    Object.keys(formData).forEach((key) => {
      if (key === "password" || key === "confirmPassword") {
        if (formData[key]) {
          postData.append(key, formData[key]);
        }
      } else {
        postData.append(key, formData[key]);
      }
    });

    // Append image file if exists
    if (imageFile) {
      postData.append("workerProfileImage", imageFile);
    }

    console.log("👷 Worker Updated - FormData prepared");

    const res = await updateWorker({ id: workerData._id, data: postData });
    if (res?.data) {
      toast.success(res?.data?.message || "Worker updated successfully");
      onClose();
    } else if (res?.error) {
      toast.error(res?.error?.data?.message || "Failed to update worker");
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={900}
      className="update-worker-modal"
    >
      <h2 className="text-lg font-semibold mb-4 text-[#e91e63]">
        Update Worker Profile
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Upload Photo */}
        <div
          className="col-span-2 flex flex-col items-center border border-dashed border-pink-200 rounded-md py-6 hover:bg-pink-50 transition cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          {imagePreview ? (
            <div className="flex flex-col items-center">
              <img
                src={imagePreview}
                alt="preview"
                className="w-32 h-32 rounded-full object-cover border-2 border-pink-200"
              />
              <p className="text-xs text-gray-500 mt-2">
                Click to change photo (Max 5MB)
              </p>
            </div>
          ) : (
            <>
              <UploadOutlined className="text-3xl text-[#e91e63]" />
              <p className="text-sm text-gray-600 mt-2">
                Upload a professional photo
              </p>
              <p className="text-xs text-gray-400">JPG, PNG, GIF up to 5MB</p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Image Error Message */}
        {imageError && (
          <div className="col-span-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{imageError}</span>
          </div>
        )}

        {/* Basic Info */}
        {Object.keys(formData).map((key) => {
          let placeholder = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (s) => s.toUpperCase());

          if (key === "workerId") placeholder = "Worker ID#";
          if (key === "zipCode") placeholder = "Zip Code";

          const isPasswordField =
            key === "password" || key === "confirmPassword";

          return (
            <div key={key} className="col-span-1 relative">
              <input
                type={
                  isPasswordField
                    ? key === "password"
                      ? showPassword
                      : showConfirmPassword
                      ? "text"
                      : "password"
                    : key === "email"
                    ? "email"
                    : "text"
                }
                name={key}
                placeholder={
                  isPasswordField
                    ? `${placeholder} (Leave blank to keep current)`
                    : placeholder
                }
                value={formData[key]}
                onChange={handleChange}
                className="w-full border border-pink-100 rounded-md px-3 py-2 pr-10 focus:border-[#e91e63] focus:outline-none"
                required={!isPasswordField}
              />
              {isPasswordField && (
                <span
                  onClick={() => {
                    if (key === "password") {
                      setShowPassword(!showPassword);
                    } else {
                      setShowConfirmPassword(!showConfirmPassword);
                    }
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-[#e91e63]"
                >
                  {(key === "password" ? showPassword : showConfirmPassword) ? (
                    <EyeTwoTone twoToneColor="#e91e63" />
                  ) : (
                    <EyeInvisibleOutlined />
                  )}
                </span>
              )}
            </div>
          );
        })}

        {/* Password Error Message */}
        {passwordError && (
          <div className="col-span-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
            {passwordError}
          </div>
        )}

        {/* Buttons */}
        <div className="col-span-2 flex justify-center gap-4 mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-md transition-all flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-[#e91e63] text-white hover:bg-pink-600"
            }`}
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={`border border-[#e91e63] px-6 py-2 rounded-md transition-all ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "text-[#e91e63] hover:bg-pink-50"
            }`}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateWorkerModal;
