import { useState, useRef, useEffect } from "react";
import { MdOutlineCloudUpload } from "react-icons/md";
import { message } from "antd";
import {
  useCreateServiceMutation,
  useGetDynamicBannerQuery,
} from "../../../redux/features/site-content/site-content";

const ServiceBanner = ({ onClose }) => {
  const [createService, { isLoading }] = useCreateServiceMutation();
  const { data } = useGetDynamicBannerQuery();
  const bannerData = data?.data;

  // Manicure states
  const [manicureBanner, setManicureBanner] = useState(null);
  const [manicurePreview, setManicurePreview] = useState(null);
  const manicureRef = useRef(null);

  // Pedicure states
  const [pedicureBanner, setPedicureBanner] = useState(null);
  const [pedicurePreview, setPedicurePreview] = useState(null);
  const pedicureRef = useRef(null);

  const handleServiceUpload = (type, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);

    if (type === "manicure") {
      setManicureBanner(file);
      setManicurePreview(url);
    } else {
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
        title = "Manicure"; // Default title for manicure
        file = manicureBanner;
      } else {
        if (!pedicureBanner) {
          message.error("Please select a file for the Pedicure banner!");
          return;
        }
        title = "Pedicure"; // Default title for pedicure
        file = pedicureBanner;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("dynamicUpload", file);

      const response = await createService(formData).unwrap();
      message.success(`${type} banner uploaded successfully!`);

      // Reset specific service state
      if (type === "manicure") {
        setManicureBanner(null);
        setManicurePreview(null);
      } else {
        setPedicureBanner(null);
        setPedicurePreview(null);
      }
    } catch (error) {
      message.error("Failed to upload service banner!");
    }
  };

  // Preview images or videos from bannerData (if available)
  const getBannerPreview = (type) => {
    const banner = bannerData?.find(
      (item) => item.title.toLowerCase() === type
    );
    if (banner) {
      return banner?.video?.startsWith("video/") ? (
        <video src={banner?.video} controls className="h-40 rounded-lg" />
      ) : (
        <img
          src={banner?.image}
          alt="Preview"
          className="h-40 rounded-lg object-cover"
        />
      );
    }
    return null;
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
          {getBannerPreview("manicure") || (
            <>
              <MdOutlineCloudUpload className="text-3xl text-[#e91e63] mb-2" />
              <p className="text-sm text-gray-500">
                Click to upload Manicure banner
              </p>
            </>
          )}
        </div>

        <input
          type="file"
          ref={manicureRef}
          onChange={(e) => handleServiceUpload("manicure", e)}
          accept="image/*,video/*"
          className="hidden"
        />

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
          {getBannerPreview("pedicure") || (
            <>
              <MdOutlineCloudUpload className="text-3xl text-[#e91e63] mb-2" />
              <p className="text-sm text-gray-500">
                Click to upload Pedicure banner
              </p>
            </>
          )}
        </div>

        <input
          type="file"
          ref={pedicureRef}
          onChange={(e) => handleServiceUpload("pedicure", e)}
          accept="image/*,video/*"
          className="hidden"
        />

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
