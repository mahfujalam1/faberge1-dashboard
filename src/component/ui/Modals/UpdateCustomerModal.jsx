import { useRef, useState, useEffect } from "react";
import { Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { useUpdateCustomerMutation } from "../../../redux/features/user/userApi";

const UpdateCustomerModal = ({ isOpen, onClose, userData }) => {
  console.log(userData);
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [updateUser, { isLoading }] = useUpdateCustomerMutation();

  // 🔹 Customer Info
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
  });

  // 🔹 Populate form with existing user data
  useEffect(() => {
    if (userData && isOpen) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        zipCode: userData.zipCode || "",
        phone: userData.phone || "",
        email: userData.email || "",
      });

      // Set existing image
      if (userData.uploadPhoto) {
        setImagePreview(userData.uploadPhoto);
      }
    }
  }, [userData, isOpen]);

  // 🔹 Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData instance
    const postData = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      postData.append(key, formData[key]);
    });

    // Append image file if exists
    if (imageFile) {
      postData.append("customerProfileImage", imageFile);
    }

    console.log("👤 Customer Updated - FormData prepared");

    const res = await updateUser({ id: userData._id, data: postData });
    if (res?.data) {
      toast.success(res?.data?.message || "Customer updated successfully");
      onClose();
    } else if (res?.error) {
      toast.error(res?.error?.data?.message || "Failed to update customer");
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={900}
      className="update-customer-modal"
    >
      <h2 className="text-lg font-semibold mb-4 text-[#e91e63]">
        Update Customer Profile
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
            <img
              src={imagePreview}
              alt="preview"
              className="w-32 h-32 rounded-full object-cover border-2 border-pink-200"
            />
          ) : (
            <>
              <UploadOutlined className="text-3xl text-[#e91e63]" />
              <p className="text-sm text-gray-600 mt-2">
                Upload a profile photo
              </p>
              <p className="text-xs text-gray-400">JPG, PNG, GIF up to 1MB</p>
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

        {/* Basic Info */}
        {Object.keys(formData).map((key) => {
          let placeholder = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (s) => s.toUpperCase());

          if (key === "zipCode") placeholder = "Zip Code";

          return (
            <div key={key} className="col-span-1">
              <input
                type={key === "email" ? "email" : "text"}
                name={key}
                placeholder={placeholder}
                readOnly={key === 'email'}
                value={formData[key]}
                onChange={handleChange}
                className="w-full border border-pink-100 rounded-md px-3 py-2 focus:border-[#e91e63] focus:outline-none"
                required
              />
            </div>
          );
        })}

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

export default UpdateCustomerModal;
