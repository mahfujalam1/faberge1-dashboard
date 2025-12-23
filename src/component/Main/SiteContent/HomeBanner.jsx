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

  // ✅ Fix: Properly destructure the mutation
  const [createService, { isLoading }] = useCreateServiceMutation();

  const { data, refetch } = useGetDynamicBannerQuery();
  const bannerData = data?.data;

  // Check if Home banner exists
  const homeBanner = bannerData?.find(
    (item) => item.title.toLowerCase() === "home"
  );

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // ✅ Validate file type
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        message.error("Please upload only image or video files!");
        return;
      }

      // ✅ Validate file size (e.g., max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        message.error("File size must be less than 50MB!");
        return;
      }

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
      formData.append("title", "home");
      formData.append("dynamicUpload", bannerFile);

      // ✅ Log FormData for debugging
      console.log("Uploading file:", {
        name: bannerFile.name,
        type: bannerFile.type,
        size: bannerFile.size,
      });

      // ✅ Use unwrap() to properly handle the response
      const response = await createService(formData).unwrap();

      toast.success(response?.message || "Banner uploaded successfully!");

      // ✅ Refetch the data to show updated banner
      await refetch();

      // Reset state after upload
      setBannerFile(null);
      setPreview(null);
      if (onClose) onClose();
    } catch (error) {
      console.error("Upload error:", error);

      // ✅ Better error handling
      const errorMessage =
        error?.data?.message || error?.message || "Failed to upload banner!";
      message.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Function to render preview (new upload or existing banner)
  const renderPreview = () => {
    // Show new upload preview if available
    if (preview && bannerFile) {
      const isVideo = bannerFile.type.startsWith("video/");
      return isVideo ? (
        <video src={preview} controls className="h-40 rounded-lg max-w-full" />
      ) : (
        <img
          src={preview}
          alt="Preview"
          className="h-40 rounded-lg object-cover max-w-full"
        />
      );
    }

    // Show existing home banner if no new upload
    if (homeBanner) {
      if (homeBanner.video) {
        return (
          <video
            src={`${import.meta.env.VITE_REACT_APP_BASE_URL}${
              homeBanner?.video
            }`}
            controls
            className="h-40 rounded-lg max-w-full"
          />
        );
      } else if (homeBanner.image) {
        return (
          <img
            src={`${import.meta.env.VITE_REACT_APP_BASE_URL}${
              homeBanner?.image
            }`}
            alt="Home Banner"
            className="h-40 rounded-lg object-cover max-w-full"
          />
        );
      }
    }

    // Show upload icon if no preview or banner
    return (
      <>
        <MdOutlineCloudUpload className="text-3xl text-[#e91e63] mb-2" />
        <p className="text-sm text-gray-500">Click to upload Home banner</p>
        <p className="text-xs text-gray-400 mt-1">
          Supports: Images & Videos (Max 50MB)
        </p>
      </>
    );
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
        {renderPreview()}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
      />

      {/* ✅ Show selected file name */}
      {bannerFile && (
        <div className="mt-2 text-sm text-gray-600">
          Selected: <span className="font-medium">{bannerFile.name}</span>
          <span className="text-gray-400 ml-2">
            ({(bannerFile.size / (1024 * 1024)).toFixed(2)} MB)
          </span>
        </div>
      )}

      <div className="mt-4 text-right space-x-2">
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md shadow transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleUploadBanner}
          disabled={isUploading || !bannerFile || isLoading}
          className="bg-[#e91e63] hover:bg-[#d81b60] text-white px-4 py-2 rounded-md shadow transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isUploading || isLoading ? "Uploading..." : "Upload Home Banner"}
        </button>
      </div>
    </div>
  );
};

export default HomeBanner;
