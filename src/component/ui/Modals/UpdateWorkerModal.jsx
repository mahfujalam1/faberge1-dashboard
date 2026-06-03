import { useRef, useState, useEffect } from "react";
import { Modal, Select, Table } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useUpdateWorkerMutation } from "../../../redux/features/worker/worker";
import { useGetAllServicesQuery } from "../../../redux/features/service/service";
import { toast } from "sonner";

const MAX_GALLERY_PHOTOS = 10;

const UpdateWorkerModal = ({ isOpen, onClose, workerData }) => {
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  // Gallery photos: existingPhotos are server paths kept from before, newGalleryFiles
  // are freshly selected File objects (with object-URL previews).
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);
  const [updateWorker, { isLoading }] = useUpdateWorkerMutation();
  const { data: servicesResp } = useGetAllServicesQuery({});
  const allServices = servicesResp?.data;

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

  // Mirrors CreateWorkerModal: selectedServices is an array of serviceName strings,
  // selectedSubServices is a map of serviceName -> array of subcategoryName strings.
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSubServices, setSelectedSubServices] = useState({});

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

      // Existing gallery photos (server paths)
      setExistingPhotos(
        Array.isArray(workerData.photos) ? workerData.photos : []
      );

      // Reset image file, new gallery selections and errors when modal opens
      setImageFile(null);
      setNewGalleryFiles([]);
      setNewGalleryPreviews([]);
      setImageError("");
      setPasswordError("");
    }
  }, [workerData, isOpen]);

  // Pre-populate selected services + sub-services once both workerData and the
  // services catalog are available. We need the catalog to translate ObjectIds
  // (worker.services[].service / subcategories) into serviceName / subcategoryName,
  // which is the shape CreateWorkerModal already standardized on.
  useEffect(() => {
    if (!isOpen || !workerData || !allServices) return;
    if (!Array.isArray(workerData.services)) {
      setSelectedServices([]);
      setSelectedSubServices({});
      return;
    }

    const names = [];
    const subMap = {};

    workerData.services.forEach((entry) => {
      // entry.service may be a populated doc OR a bare ObjectId string.
      const serviceId =
        typeof entry.service === "object" && entry.service !== null
          ? entry.service._id
          : entry.service;

      const serviceDoc = allServices.find(
        (s) => s._id?.toString() === String(serviceId)
      );
      if (!serviceDoc) return;

      names.push(serviceDoc.serviceName);

      const subIds = (entry.subcategories || []).map((s) =>
        typeof s === "object" && s !== null ? s._id : s
      );
      const subNames = (serviceDoc.subcategory || [])
        .filter((sub) => subIds.some((id) => String(id) === String(sub._id)))
        .map((sub) => sub.subcategoryName);

      if (subNames.length > 0) subMap[serviceDoc.serviceName] = subNames;
    });

    setSelectedServices(names);
    setSelectedSubServices(subMap);
  }, [workerData, allServices, isOpen]);

  const handleSelectMainService = (value) => {
    if (!selectedServices.includes(value)) {
      setSelectedServices([...selectedServices, value]);
    }
  };

  const handleSelectSubService = (mainName, value) => {
    setSelectedSubServices((prev) => ({ ...prev, [mainName]: value }));
  };

  const handleDeleteService = (name) => {
    setSelectedServices(selectedServices.filter((s) => s !== name));
    const newSub = { ...selectedSubServices };
    delete newSub[name];
    setSelectedSubServices(newSub);
  };

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

  // Gallery photos (existing kept + new) capped at 10 total
  const totalGalleryCount = existingPhotos.length + newGalleryFiles.length;

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = MAX_GALLERY_PHOTOS - totalGalleryCount;
    if (remaining <= 0) {
      toast.error(`You can have a maximum of ${MAX_GALLERY_PHOTOS} photos`);
      e.target.value = "";
      return;
    }

    const accepted = files.slice(0, remaining);
    if (files.length > remaining) {
      toast.error(
        `Only ${remaining} more photo(s) can be added (max ${MAX_GALLERY_PHOTOS})`
      );
    }

    setNewGalleryFiles((prev) => [...prev, ...accepted]);
    setNewGalleryPreviews((prev) => [
      ...prev,
      ...accepted.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = "";
  };

  const handleRemoveExistingPhoto = (index) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewPhoto = (index) => {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
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

    // Gallery: tell the backend which existing photos to keep, and upload new ones.
    postData.append("existingPhotos", JSON.stringify(existingPhotos));
    newGalleryFiles.forEach((file) => {
      postData.append("workerPhotos", file);
    });

    // Translate selectedServices/selectedSubServices (name-based) back into
    // the ObjectId payload the backend expects: [{ service, subcategories }].
    const servicesArray = selectedServices
      .map((srv) => {
        const found = allServices?.find((s) => s.serviceName === srv);
        if (!found) return null;
        return {
          service: found._id,
          subcategories:
            found?.subcategory?.length > 0
              ? (selectedSubServices[srv] || [])
                  .map((subName) => {
                    const subDoc = found.subcategory.find(
                      (ss) => ss.subcategoryName === subName
                    );
                    return subDoc?._id;
                  })
                  .filter(Boolean)
              : [],
        };
      })
      .filter(Boolean);

    postData.append("services", JSON.stringify(servicesArray));

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

        {/* Gallery Photos (max 10) */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium text-gray-700">
              Gallery Photos (shown on website)
            </label>
            <span className="text-xs text-gray-500">
              {totalGalleryCount}/{MAX_GALLERY_PHOTOS}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {/* Existing photos already saved on the server */}
            {existingPhotos.map((path, idx) => (
              <div
                key={`existing-${path}`}
                className="relative w-full aspect-square rounded-md overflow-hidden border border-pink-100 group"
              >
                <img
                  src={`${import.meta.env.VITE_REACT_APP_BASE_URL}${path}`}
                  alt={`gallery-${idx}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingPhoto(idx)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                  aria-label="Remove photo"
                >
                  <DeleteOutlined />
                </button>
              </div>
            ))}

            {/* Newly selected photos (not yet uploaded) */}
            {newGalleryPreviews.map((src, idx) => (
              <div
                key={`new-${src}`}
                className="relative w-full aspect-square rounded-md overflow-hidden border border-pink-100 group"
              >
                <img
                  src={src}
                  alt={`new-gallery-${idx}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNewPhoto(idx)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                  aria-label="Remove photo"
                >
                  <DeleteOutlined />
                </button>
              </div>
            ))}

            {totalGalleryCount < MAX_GALLERY_PHOTOS && (
              <button
                type="button"
                onClick={() => galleryInputRef.current.click()}
                className="w-full aspect-square rounded-md border border-dashed border-pink-200 flex flex-col items-center justify-center text-[#e91e63] hover:bg-pink-50 transition cursor-pointer"
              >
                <UploadOutlined className="text-xl" />
                <span className="text-[10px] mt-1">Add</span>
              </button>
            )}
          </div>

          <input
            type="file"
            ref={galleryInputRef}
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
            className="hidden"
          />
        </div>

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

        {/* Main Services */}
        <div className="col-span-2 mt-3">
          <label className="font-medium text-gray-700 mb-2 block">
            Select Main Services
          </label>
          <Select
            placeholder="Select a service"
            style={{ width: "100%" }}
            value={undefined}
            onSelect={handleSelectMainService}
            options={allServices
              ?.filter((s) => !selectedServices.includes(s.serviceName))
              .map((s) => ({
                label: s.serviceName,
                value: s.serviceName,
              }))}
          />
        </div>

        {/* Selected Services */}
        {selectedServices.length > 0 && (
          <div className="col-span-2 mt-6 bg-pink-50 border border-pink-100 rounded-lg p-4">
            <h3 className="text-md font-semibold text-[#e91e63] mb-3">
              Selected Services
            </h3>

            {selectedServices?.map((srv) => {
              const service = allServices?.find((s) => s.serviceName === srv);
              const hasSub = service?.subcategory?.length > 0;

              return (
                <div
                  key={srv}
                  className="bg-white border border-pink-100 rounded-lg mb-4 p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800">
                      {srv} —{" "}
                      <span className="text-gray-500">${service?.price}</span>
                    </h4>
                    <DeleteOutlined
                      onClick={() => handleDeleteService(srv)}
                      className="text-red-500 cursor-pointer hover:text-red-700"
                    />
                  </div>

                  {hasSub ? (
                    <>
                      <p className="text-sm text-gray-600 mb-2">
                        Select Extra Services:
                      </p>
                      <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Select sub-services"
                        value={selectedSubServices[srv] || []}
                        onChange={(v) => handleSelectSubService(srv, v)}
                        options={service?.subcategory?.map((ss) => ({
                          label: `${ss.subcategoryName} ($${ss.subcategoryPrice})`,
                          value: ss.subcategoryName,
                        }))}
                      />

                      {selectedSubServices[srv]?.length > 0 && (
                        <Table
                          className="mt-3"
                          dataSource={service?.subcategory
                            .filter((ss) =>
                              selectedSubServices[srv]?.includes(
                                ss.subcategoryName
                              )
                            )
                            .map((ss, i) => ({
                              key: i,
                              name: ss.subcategoryName,
                              price: `$${ss.subcategoryPrice}`,
                            }))}
                          pagination={false}
                          size="small"
                          bordered
                          columns={[
                            { title: "Sub Service", dataIndex: "name" },
                            { title: "Price", dataIndex: "price" },
                          ]}
                        />
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-600 italic">
                      No sub-services (Base price ${service?.price})
                    </p>
                  )}
                </div>
              );
            })}
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
