import { useRef, useState } from "react";
import { Modal, Select, Table } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useGetAllServicesQuery } from "../../../redux/features/service/service";
import { useCreateWorkerMutation } from "../../../redux/features/worker/worker";
import { toast } from "sonner";

const CreateWorkerModal = ({ isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const { data } = useGetAllServicesQuery({});
  const [createWorker, { isLoading }] = useCreateWorkerMutation();
  const allServices = data?.data;

  // 🔹 Worker Info
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

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSubServices, setSelectedSubServices] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // 🔹 Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear password error when user types
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setPasswordError("");
    }
  };

  // 🔹 Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Select main service
  const handleSelectMainService = (value) => {
    if (!selectedServices.includes(value)) {
      setSelectedServices([...selectedServices, value]);
    }
  };

  // 🔹 Select sub-service
  const handleSelectSubService = (mainName, value) => {
    setSelectedSubServices((prev) => ({
      ...prev,
      [mainName]: value,
    }));
  };

  // 🔹 Remove service
  const handleDeleteService = (name) => {
    setSelectedServices(selectedServices.filter((s) => s !== name));
    const newSub = { ...selectedSubServices };
    delete newSub[name];
    setSelectedSubServices(newSub);
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long!");
      return;
    }

    // Create FormData instance
    const postData = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      postData.append(key, formData[key]);
    });

    // Append image file if exists
    if (imageFile) {
      postData.append("workerProfileImage", imageFile);
    }

    // Prepare services array
    const servicesArray = selectedServices.map((srv) => {
      const found = allServices?.find((s) => s.serviceName === srv);
      return {
        service: found._id,
        subcategories:
          found?.subcategory.length > 0
            ? (selectedSubServices[srv] || []).map((sub) => {
                const subService = found.subcategory.find(
                  (ss) => ss.subcategoryName === sub
                );
                return subService._id;
              })
            : [],
      };
    });

    // Append services as JSON string
    postData.append("services", JSON.stringify(servicesArray));

    console.log("👷 Worker Created - FormData prepared");
    console.log("Services:", servicesArray);

    const res = await createWorker(postData);
    if (res?.data) {
      toast.success(res?.data?.message);
      setFormData({
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
      setImagePreview(null);
      setImageFile(null);
      setSelectedServices([]);
      setSelectedSubServices({});
      setPasswordError("");
    } else if (res?.error) {
      toast.error(res?.error?.data?.message || "Failed to create worker");
    }

    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={900}
      className="create-worker-modal"
    >
      <h2 className="text-lg font-semibold mb-4 text-[#e91e63]">
        Create Worker Profile
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
                Upload a professional photo
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
                        ? "text"
                        : "password"
                      : showConfirmPassword
                      ? "text"
                      : "password"
                    : key === "email"
                    ? "email"
                    : "text"
                }
                name={key}
                placeholder={placeholder}
                value={formData[key]}
                onChange={handleChange}
                className="w-full border border-pink-100 rounded-md px-3 py-2 pr-10 focus:border-[#e91e63] focus:outline-none"
                required
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
            onSelect={handleSelectMainService}
            options={allServices?.map((s) => ({
              label: s.serviceName,
              value: s.serviceName,
            }))}
          />
        </div>

        {/* Selected Services Table */}
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
                Creating...
              </>
            ) : (
              "Create Profile"
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

export default CreateWorkerModal;
