import { useState, useRef, useEffect } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import { message } from "antd";
import {
  useCreateServiceMutation,
  useGetDynamicBannerQuery,
} from "../../../redux/features/site-content/site-content";
import { toast } from "sonner";

const HomeBanner = ({ onClose }) => {
  const [bannerFile, setBannerFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { data } = useGetDynamicBannerQuery();
  const bannerData = data?.data;

  // Check if Home banner exists
  const homeBanner = bannerData?.find(
    (item) => item.title.toLowerCase() === "home"
  );

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleUploadBanner = async () => {
    if (!bannerFile) {
      message.error("Please select a file first!");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", "Home"); // Set default title to Home
      formData.append("dynamicUpload", bannerFile);

      const response = await createService(formData);
      toast.success(response?.data?.message);

      // Reset state after upload
      setBannerFile(null);
      setPreview(null);
      if (onClose) onClose();
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Failed to upload banner!");
    } finally {
      setIsUploading(false);
    }
  };

  // Function to render Home banner preview (image/video)
  const getHomeBannerPreview = () => {
    if (homeBanner) {
      if (homeBanner.video) {
        return (
          <video src={homeBanner.video} controls className="h-40 rounded-lg" />
        );
      } else if (homeBanner.image) {
        return (
          <img
            src={homeBanner.image}
            alt="Preview"
            className="h-40 rounded-lg object-cover"
          />
        );
      }
    }
    return null;
  };

  return (
    <div className="bg-white p-6 border border-pink-100 rounded-lg mb-4 shadow-sm">
      <p className="text-gray-600 mb-3">
        Upload Image or Video for Home Banner
      </p>

      <div
        onClick={handleFileClick}
        className="border-2 border-dashed border-pink-200 rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-50 transition-all"
      >
        {getHomeBannerPreview() || (
          <>
            <MdOutlineCloudUpload className="text-3xl text-[#e91e63] mb-2" />
            <p className="text-sm text-gray-500">Click to upload Home banner</p>
          </>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
      />

      <div className="mt-4 text-right space-x-2">
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md shadow transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleUploadBanner}
          disabled={isUploading || !bannerFile}
          className="bg-[#e91e63] hover:bg-[#d81b60] text-white px-4 py-2 rounded-md shadow transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading..." : "Upload Home Banner"}
        </button>
      </div>
    </div>
  );
};

export default HomeBanner;
