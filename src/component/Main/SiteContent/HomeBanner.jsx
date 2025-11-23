import { useState, useRef } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import { message } from "antd";

const HomeBanner = ({ onClose }) => {
  const [bannerFile, setBannerFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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
      formData.append("file", bannerFile);

      // API call korte hobe ekhane
      // const response = await fetch('/api/upload-banner', {
      //   method: 'POST',
      //   body: formData
      // });

      console.log("✅ Home Banner FormData:", formData);
      console.log("✅ File:", bannerFile);

      message.success("Banner uploaded successfully!");

      // Reset state
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

  return (
    <div className="bg-white p-6 border border-pink-100 rounded-lg mb-4 shadow-sm">
      <p className="text-gray-600 mb-3">Upload Image or Video</p>
      <div
        onClick={handleFileClick}
        className="border-2 border-dashed border-pink-200 rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-50 transition-all"
      >
        {preview ? (
          bannerFile?.type?.startsWith("video/") ? (
            <video src={preview} controls className="h-40 rounded-lg" />
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="h-40 rounded-lg object-cover"
            />
          )
        ) : (
          <>
            <MdOutlineCloudUpload className="text-3xl text-[#e91e63] mb-2" />
            <p className="text-sm text-gray-500">
              Click to upload image or video
            </p>
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
          {isUploading ? "Uploading..." : "Upload Banner"}
        </button>
      </div>
    </div>
  );
};

export default HomeBanner;
