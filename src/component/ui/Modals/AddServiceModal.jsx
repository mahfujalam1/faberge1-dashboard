import React, { useState } from "react";
import { Modal } from "antd";
import { useAddServiceMutation } from "../../../redux/features/service/service";
import { toast } from "sonner";

const AddServiceModal = ({ isOpen, onClose }) => {
  const [service, setService] = useState({
    serviceName: "",
    price: 0,
    subcategory: [],
  });
  const [addService] = useAddServiceMutation();

  // 🔹 Handle main service input
  const handleMainChange = (e) => {
    const { name, value } = e.target;

    const updatedValue = name === "price" ? parseFloat(value) : value;

    setService((prev) => ({ ...prev, [name]: updatedValue }));
  };

  // 🔹 Add a sub-service (max 4)
  const handleAddSubService = () => {
    if (service.subcategory.length >= 4) return;
    setService((prev) => ({
      ...prev,
      subcategory: [
        ...prev.subcategory,
        { subcategoryName: "", subcategoryPrice: null },
      ],
    }));
  };

  // 🔹 Handle sub-service change
  const handleSubChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...service.subcategory];

    updated[index][name] =
      name === "subcategoryPrice" ? parseFloat(value) : value;

    setService((prev) => ({ ...prev, subcategory: updated }));
  };

  // 🔹 Remove sub-service
  const handleRemoveSubService = (index) => {
    const updated = [...service.subcategory];
    updated.splice(index, 1);
    setService((prev) => ({ ...prev, subcategory: updated }));
  };

  // 🔹 Create service
  const handleCreate = async () => {
    try {
      if (!service.serviceName || isNaN(service.price)) return;

      const newService = {
        ...service,
        subcategory: service.subcategory.filter(
          (s) => s.subcategoryName.trim() && !isNaN(s.subcategoryPrice)
        ),
      };

      const res = await addService(newService).unwrap();
      toast.success(res?.message);

      onClose();

      // Reset after submit
      setService({ serviceName: "", price: 0, subcategory: [] });
    } catch (err) {
      setService({ serviceName: "", price: 0, subcategory: [] });
      console.log(err);
      toast.error(err);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      className="create-service-modal"
    >
      <h2 className="text-lg font-semibold mb-4 text-[#e91e63]">
        Create Service
      </h2>
      <hr className="border-gray-200 mb-5" />

      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* 🔹 Main Service Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Service Name
            </label>
            <input
              type="text"
              name="serviceName" // Change name attribute to match state property
              value={service.serviceName} // Reference serviceName in value
              onChange={handleMainChange}
              className="border border-pink-100 rounded-md px-3 py-2 w-full focus:border-[#e91e63] focus:outline-none"
              placeholder="Enter Service Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price ($)</label>
            <input
              type="number"
              name="price"
              value={service.price || Number}
              onChange={handleMainChange}
              className="border border-pink-100 rounded-md px-3 py-2 w-full focus:border-[#e91e63] focus:outline-none"
              placeholder="Enter Price"
            />
          </div>
        </div>

        {/* 🔹 Add Ones Section */}
        <div className="bg-pink-50 border border-pink-100 rounded-md p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">Add-Ons (Optional)</h4>

            <button
              type="button"
              onClick={handleAddSubService}
              disabled={service.subcategory.length >= 4}
              className={`border border-[#e91e63] text-[#e91e63] bg-white py-1 px-3 rounded-md text-sm font-medium transition-all ${
                service.subcategory.length >= 4
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-pink-50"
              }`}
            >
              + Add-Ons
            </button>
          </div>

          {service.subcategory.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              No sub-service added yet.
            </p>
          )}

          {service.subcategory.map((sub, i) => (
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
                  value={sub.subcategoryPrice || Number}
                  onChange={(e) => handleSubChange(i, e)}
                  className="border border-pink-100 rounded-md px-3 py-2 w-full focus:border-[#e91e63] focus:outline-none"
                  placeholder="Price ($)"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveSubService(i)}
                className="absolute -right-2 top-2 text-red-500 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Limit Message */}
          {service.subcategory.length >= 4 && (
            <p className="text-xs text-gray-500 italic text-center mt-2">
              You can add a maximum of 4 Add-Ons per service.
            </p>
          )}
        </div>

        {/* 🔹 Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleCreate}
            className="bg-[#e91e63] text-white py-2 px-8 rounded-md hover:bg-pink-600 transition-all"
          >
            Create
          </button>
          <button
            onClick={onClose}
            className="border border-[#e91e63] text-[#e91e63] py-2 px-8 rounded-md hover:bg-pink-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddServiceModal;
