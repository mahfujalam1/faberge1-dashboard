import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import UpdateServiceModal from "../../component/ui/Modals/UpdateServiceModal";
import ConfirmationModal from "../../component/ui/Modals/ConfirmationModal";
import AddServiceModal from "../../component/ui/Modals/AddServiceModal";
import { allServices } from "../../constants/service";
import { Button, Skeleton, Tooltip } from "antd";
import {
  useDeleteServiceMutation,
  useGetAllServicesQuery,
} from "../../redux/features/service/service";
import { toast } from "sonner";

const ServicePage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [service, setService] = useState({});

  const { data, isLoading } = useGetAllServicesQuery({});
  const [deleteService] = useDeleteServiceMutation();
  const services = data?.data;

  const handleUpdate = (service) => {
    setService(service);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteService(id);
      toast.success(res?.data?.message);
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  };

  return (
    <div className="p-6 overflow-x-auto md:w-[420px] lg:w-[680px] xl:w-full">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">Services</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#e91e63] text-white py-2 px-5 rounded-md shadow hover:bg-pink-600 transition-all"
        >
          + Add New
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl border border-pink-100 shadow-sm">
        <table className="w-full text-left text-sm text-gray-700 min-w-[600px]">
          <thead className="bg-pink-50 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Service Name</th>
              <th className="px-6 py-3">Price ($)</th>
              <th className="px-6 py-3">Add-Ons</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          {!isLoading ? (
            <tbody>
              {services?.map((service) => (
                <tr
                  key={service._id}
                  className="border-b border-pink-100 hover:bg-pink-50 transition-all"
                >
                  <td className="px-6 py-3">
                    <div>
                      <p className="font-medium">{service.serviceName}</p>
                      {/* Show sub-services if any */}
                    </div>
                  </td>
                  <td className="px-6 py-3">${service.price}</td>
                  <td className="px-6 py-3">
                    {service.subcategory?.length > 0 && (
                      <ul className="text-xs text-gray-500 mt-1 list-disc ml-5">
                        {service.subcategory.map((sub, idx) => (
                          <li key={idx}>
                            {sub.subcategoryName} — ${sub.subcategoryPrice}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right flex justify-end gap-4 text-[#e91e63]">
                    <EditOutlined
                      onClick={() => handleUpdate(service)}
                      className="cursor-pointer hover:text-pink-500 text-lg"
                    />
                    <DeleteOutlined
                      onClick={() => handleDelete(service._id)}
                      className="cursor-pointer hover:text-red-500 text-lg"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="4" className="px-6 py-3">
                  <Skeleton active paragraph={{ rows: 1 }} />
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <div className="mt-6">
        <h1 className="text-xl font-semibold text-gray-800">Service Hours</h1>
        <div className="flex items-center gap-2 mt-3">
          <Tooltip title="Service opening time">
            <div className="border-2 shadow border-pink-600 rounded-md px-4 py-2 bg-white">
              Open 🕔 09:00 AM
            </div>
          </Tooltip>
          <Tooltip title="Service closing time">
            <div className="border-2 shadow border-pink-600 rounded-md px-4 py-2 bg-white">
              Close 🕔 07:00 PM
            </div>
          </Tooltip>
        </div>
      </div>

      <UpdateServiceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        service={service}
      />

      <AddServiceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default ServicePage;
