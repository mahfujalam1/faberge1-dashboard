import { useState, useEffect } from "react";
import { Modal } from "antd";
import { useUpdateServiceMutation } from "../../../redux/features/service/service";
import { toast } from "sonner";

const UpdateServiceModal = ({ isOpen, service, onClose }) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    price: "",
    subcategory: [],
  });

  const [updateService] = useUpdateServiceMutation();
  const serviceId = service?._id;

  // 🔹 When service data comes in, load it into form
  useEffect(() => {
    if (service) {
      setFormData({
        serviceName: service.serviceName || "",
        price: service.price || 0,
        subcategory: service.subcategory ? [...service.subcategory] : [],
      });
    }
  }, [service]);

  // 🔹 Handle main service input
  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle sub-service input - FIXED VERSION
  const handleSubChange = (index, e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedSubcategories = [...prev.subcategory];

      // Update the specific field at the given index
      updatedSubcategories[index] = {
        ...updatedSubcategories[index],
        [name]: name === "subcategoryPrice" ? parseFloat(value) || 0 : value,
      };

      return { ...prev, subcategory: updatedSubcategories };
    });
  };

  // 🔹 Add a new sub-service
  const handleAddSub = () => {
    setFormData((prev) => ({
      ...prev,
      subcategory: [
        ...prev.subcategory,
        { subcategoryName: "", subcategoryPrice: 0 },
      ],
    }));
  };

  // 🔹 Remove sub-service
  const handleRemoveSub = (index) => {
    setFormData((prev) => ({
      ...prev,
      subcategory: prev.subcategory.filter((_, i) => i !== index),
    }));
  };

  // 🔹 Save updated data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        serviceName: formData.serviceName.trim(),
        price: parseFloat(formData.price),
        subcategory: formData.subcategory.filter(
          (sub) =>
            sub.subcategoryName.trim() !== "" &&
            !isNaN(sub.subcategoryPrice) &&
            sub.subcategoryPrice !== null
        ),
      };
      const res = await updateService({ id: serviceId, data: updatedData });
      console.log(res);
      onClose();
      toast.success(res?.data?.message);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update service.");
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      className="update-service-modal"
    >
      <h2 className="text-lg font-semibold mb-4 text-[#e91e63]">
        Update Service
      </h2>
      <hr className="border-gray-300 mb-5" />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 🔹 Main Service Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Name
          </label>
          <input
            type="text"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleMainChange}
            placeholder="Enter Service Name"
            className="w-full border border-pink-100 rounded-md px-3 py-2 focus:border-[#e91e63] focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleMainChange}
            placeholder="Enter Price"
            className="w-full border border-pink-100 rounded-md px-3 py-2 focus:border-[#e91e63] focus:outline-none"
            required
          />
        </div>

        {/* 🔹 Sub-Services (If Exist) */}
        <div className="bg-pink-50 border border-pink-100 rounded-md p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">Add Ons (Optional)</h4>
            <button
              type="button"
              onClick={handleAddSub}
              className="border border-[#e91e63] text-[#e91e63] bg-white py-1 px-3 rounded-md hover:bg-pink-50 transition-all text-sm font-medium"
            >
              + Add Ons
            </button>
          </div>

          {formData.subcategory.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              No sub-service added yet.
            </p>
          )}

          {formData.subcategory.map((sub, i) => (
            <div
              key={i}
              className="grid grid-cols-2 gap-4 mb-3 relative bg-white border border-pink-100 rounded-md p-3"
            >
              <div>
                <input
                  type="text"
                  name="subcategoryName"
                  value={sub.subcategoryName}
                  onChange={(e) => handleSubChange(i, e)}
                  className="border border-pink-100 rounded-md px-3 py-2 w-full focus:border-[#e91e63] focus:outline-none"
                  placeholder="Sub-service Name"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="subcategoryPrice"
                  value={sub.subcategoryPrice || ""}
                  onChange={(e) => handleSubChange(i, e)}
                  className="border border-pink-100 rounded-md px-3 py-2 w-full focus:border-[#e91e63] focus:outline-none"
                  placeholder="Price ($)"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSub(i)}
                className="absolute -right-2 top-2 text-red-500 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* 🔹 Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            type="submit"
            className="bg-[#e91e63] text-white px-8 py-2 rounded-md hover:bg-pink-600 transition-all font-medium"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border border-[#e91e63] text-[#e91e63] px-8 py-2 rounded-md hover:bg-pink-50 transition-all font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateServiceModal;
