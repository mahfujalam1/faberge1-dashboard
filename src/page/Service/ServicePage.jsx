import { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import UpdateServiceModal from "../../component/ui/Modals/UpdateServiceModal";
import AddServiceModal from "../../component/ui/Modals/AddServiceModal";
import { Skeleton, Tooltip, Popconfirm } from "antd";
import {
  useDeleteServiceMutation,
  useGetAllServicesQuery,
  useGetCurrentServiceTimeQuery,
  useUpdateServiceTimeMutation,
} from "../../redux/features/service/service";
import { toast } from "sonner";
import UpdateServiceTimeModal from "../../component/ui/Modals/UpdateServiceTimeModal";

const ServicePage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [service, setService] = useState({});
  const [currentServiceTime, setCurrentServiceTime] = useState({
    startTime: "09:00",
    endTime: "19:00",
  });

  const { data: timeData } = useGetCurrentServiceTimeQuery();
  const serviceTime = timeData?.data;

  const { data, isLoading } = useGetAllServicesQuery({});
  const [deleteService] = useDeleteServiceMutation();
  const [updateServiceTime, { isLoading: timeUpdateLoading }] =
    useUpdateServiceTimeMutation();
  const services = data?.data;

  // Set service time from API when data is fetched
  useEffect(() => {
    if (serviceTime) {
      setCurrentServiceTime({
        startTime: serviceTime.startTime || "09:00",
        endTime: serviceTime.endTime || "19:00",
      });
    }
  }, [serviceTime]);

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

  const handleOpenTimeModal = () => {
    setShowTimeModal(true);
  };

  const handleUpdateServiceTime = async (timeData) => {
    try {
      const res = await updateServiceTime(timeData).unwrap();
      toast.success(res?.message || "Service time updated successfully");
      setCurrentServiceTime(timeData);
      setShowTimeModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update service time");
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
              {services?.length > 0 ? (
                services?.map((service) => (
                  <tr
                    key={service._id}
                    className="border-b border-pink-100 hover:bg-pink-50 transition-all"
                  >
                    <td className="px-6 py-3">
                      <div>
                        <p className="font-medium">{service.serviceName}</p>
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
                      <Popconfirm
                        title="Are you sure you want to delete this service?"
                        onConfirm={() => handleDelete(service._id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined className="cursor-pointer hover:text-red-500 text-lg" />
                      </Popconfirm>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No Service found
                  </td>
                </tr>
              )}
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
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold text-gray-800">Service Hours</h1>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip title="Service opening time">
            <div className="border-2 shadow border-pink-600 rounded-md px-4 py-2 bg-white">
              Open 🕔 {currentServiceTime.startTime}
            </div>
          </Tooltip>
          <Tooltip title="Service closing time">
            <div className="border-2 shadow border-pink-600 rounded-md px-4 py-2 bg-white">
              Close 🕔 {currentServiceTime.endTime}
            </div>
          </Tooltip>
          <button
            onClick={handleOpenTimeModal}
            className="flex items-center gap-2 text-[#e91e63] hover:text-pink-600 transition-colors"
          >
            <EditOutlined className="text-lg" />
            <span className="text-sm font-medium">Edit Time</span>
          </button>
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

      <UpdateServiceTimeModal
        isOpen={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        currentTime={currentServiceTime}
        onUpdate={handleUpdateServiceTime}
        isLoading={timeUpdateLoading}
      />
    </div>
  );
};

export default ServicePage;
