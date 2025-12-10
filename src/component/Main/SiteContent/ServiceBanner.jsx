import { useState, useRef, useEffect } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import { message } from "antd";
import {
  useCreateServiceMutation,
  useGetDynamicBannerQuery,
} from "../../../redux/features/site-content/site-content";

const ServiceBanner = ({ onClose }) => {
  const [createService, { isLoading }] = useCreateServiceMutation();
  const { data, refetch } = useGetDynamicBannerQuery();
  const bannerData = data?.data;

  // Manicure states
  const [manicureBanner, setManicureBanner] = useState(null);
  const [manicurePreview, setManicurePreview] = useState(null);
  const manicureRef = useRef(null);

  // Pedicure states
  const [pedicureBanner, setPedicureBanner] = useState(null);
  const [pedicurePreview, setPedicurePreview] = useState(null);
  const pedicureRef = useRef(null);

  // ✅ Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (manicurePreview) URL.revokeObjectURL(manicurePreview);
      if (pedicurePreview) URL.revokeObjectURL(pedicurePreview);
    };
  }, [manicurePreview, pedicurePreview]);

  const handleServiceUpload = (type, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Validate file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      message.error("Please upload only image or video files!");
      return;
    }

    // ✅ Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      message.error("File size must be less than 50MB!");
      return;
    }

    const url = URL.createObjectURL(file);

    if (type === "manicure") {
      // Cleanup old preview
      if (manicurePreview) URL.revokeObjectURL(manicurePreview);
      setManicureBanner(file);
      setManicurePreview(url);
    } else {
      // Cleanup old preview
      if (pedicurePreview) URL.revokeObjectURL(pedicurePreview);
      setPedicureBanner(file);
      setPedicurePreview(url);
    }
  };

  const handleUploadServiceBanner = async (type) => {
    try {
      let title, file;

      if (type === "manicure") {
        if (!manicureBanner) {
          message.error("Please select a file for the Manicure banner!");
          return;
        }
        title = "Manicure";
        file = manicureBanner;
      } else {
        if (!pedicureBanner) {
          message.error("Please select a file for the Pedicure banner!");
          return;
        }
        title = "Pedicure";
        file = pedicureBanner;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("dynamicUpload", file);

      // ✅ Log for debugging
      console.log(`Uploading ${type} banner:`, {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      const response = await createService(formData).unwrap();
      message.success(
        response?.message || `${type} banner uploaded successfully!`
      );

      // ✅ Refetch to get updated banners
      await refetch();

      // Reset specific service state
      if (type === "manicure") {
        if (manicurePreview) URL.revokeObjectURL(manicurePreview);
        setManicureBanner(null);
        setManicurePreview(null);
      } else {
        if (pedicurePreview) URL.revokeObjectURL(pedicurePreview);
        setPedicureBanner(null);
        setPedicurePreview(null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to upload service banner!";
      message.error(errorMessage);
    }
  };

  // ✅ Fixed: Render preview for new upload or existing banner
  const renderBannerPreview = (type) => {
    // Show new upload preview if available
    if (type === "manicure" && manicurePreview && manicureBanner) {
      const isVideo = manicureBanner.type.startsWith("video/");
      return isVideo ? (
        <video
          src={manicurePreview}
          controls
          className="h-40 rounded-lg max-w-full"
        />
      ) : (
        <img
          src={manicurePreview}
          alt="Manicure Preview"
          className="h-40 rounded-lg object-cover max-w-full"
        />
      );
    }

    if (type === "pedicure" && pedicurePreview && pedicureBanner) {
      const isVideo = pedicureBanner.type.startsWith("video/");
      return isVideo ? (
        <video
          src={pedicurePreview}
          controls
          className="h-40 rounded-lg max-w-full"
        />
      ) : (
        <img
          src={pedicurePreview}
          alt="Pedicure Preview"
          className="h-40 rounded-lg object-cover max-w-full"
        />
      );
    }

    // Show existing banner from server
    const banner = bannerData?.find(
      (item) => item.title.toLowerCase() === type
    );

    if (banner) {
      if (banner.video) {
        return (
          <video
            src={banner.video}
            controls
            className="h-40 rounded-lg max-w-full"
          />
        );
      } else if (banner.image) {
        return (
          <img
            src={banner.image}
            alt={`${type} Banner`}
            className="h-40 rounded-lg object-cover max-w-full"
          />
        );
      }
    }

    // Show upload prompt
    return (
      <>
        <MdOutlineCloudUpload className="text-3xl text-[#e91e63] mb-2" />
        <p className="text-sm text-gray-500">
          Click to upload {type.charAt(0).toUpperCase() + type.slice(1)} banner
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Supports: Images & Videos (Max 50MB)
        </p>
      </>
    );
  };

  return (
    <div className="bg-white p-6 border border-pink-100 rounded-lg mb-4 shadow-sm space-y-6">
      <p className="text-gray-600 mb-3">
        Upload separate banners for Manicure and Pedicure services.
      </p>

      {/* Manicure Banner */}
      <div>
        <h3 className="font-medium text-gray-800 mb-2">Manicure Banner</h3>

        <div
          onClick={() => manicureRef.current.click()}
          className="border-2 border-dashed border-pink-200 rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-50 transition-all"
        >
          {renderBannerPreview("manicure")}
        </div>

        <input
          type="file"
          ref={manicureRef}
          onChange={(e) => handleServiceUpload("manicure", e)}
          accept="image/*,video/*"
          className="hidden"
        />

        {/* ✅ Show selected file info */}
        {manicureBanner && (
          <div className="mt-2 text-sm text-gray-600">
            Selected: <span className="font-medium">{manicureBanner.name}</span>
            <span className="text-gray-400 ml-2">
              ({(manicureBanner.size / (1024 * 1024)).toFixed(2)} MB)
            </span>
          </div>
        )}

        <div className="mt-4 text-right">
          <button
            onClick={() => handleUploadServiceBanner("manicure")}
            disabled={isLoading || !manicureBanner}
            className="bg-[#e91e63] hover:bg-[#d81b60] text-white px-4 py-2 rounded-md shadow transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Uploading..." : "Upload Manicure Banner"}
          </button>
        </div>
      </div>

      {/* Pedicure Banner */}
      <div>
        <h3 className="font-medium text-gray-800 mb-2">Pedicure Banner</h3>

        <div
          onClick={() => pedicureRef.current.click()}
          className="border-2 border-dashed border-pink-200 rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-50 transition-all"
        >
          {renderBannerPreview("pedicure")}
        </div>

        <input
          type="file"
          ref={pedicureRef}
          onChange={(e) => handleServiceUpload("pedicure", e)}
          accept="image/*,video/*"
          className="hidden"
        />

        {/* ✅ Show selected file info */}
        {pedicureBanner && (
          <div className="mt-2 text-sm text-gray-600">
            Selected: <span className="font-medium">{pedicureBanner.name}</span>
            <span className="text-gray-400 ml-2">
              ({(pedicureBanner.size / (1024 * 1024)).toFixed(2)} MB)
            </span>
          </div>
        )}

        <div className="mt-4 text-right">
          <button
            onClick={() => handleUploadServiceBanner("pedicure")}
            disabled={isLoading || !pedicureBanner}
            className="bg-[#e91e63] hover:bg-[#d81b60] text-white px-4 py-2 rounded-md shadow transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Uploading..." : "Upload Pedicure Banner"}
          </button>
        </div>
      </div>

      <div className="mt-4 text-right">
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md shadow transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ServiceBanner;
