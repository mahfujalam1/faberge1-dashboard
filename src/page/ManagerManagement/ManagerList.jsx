import { LockOutlined, DeleteOutlined } from "@ant-design/icons";
import { ScaleLoader } from "react-spinners";
import { useDeleteManagerMutation } from "../../redux/features/dashboard/dashboardApi";
import { toast } from "sonner";
import { Popconfirm, Table } from "antd";
import UserDetailsModal from "../../component/ui/Modals/UserDetailsModal";
import { useState } from "react";

const ManagerList = ({
  onDelete,
  onOpenAccess,
  managers,
  isLoading,
  searchValue,
  setSearchValue,
}) => {
  const [deleteManager] = useDeleteManagerMutation();
  const [openModal, setOpenModal] = useState(false);
  const [detailsData, setDetailsData] = useState({});

  const handleDeleteConfirm = async (managerId) => {
    const res = await deleteManager(managerId);
    if (res?.data?.data) {
      toast.success(res?.data?.message);
    } else if (res?.data?.error) {
      toast.error(res?.error?.message);
    }
  };

  const handleViewManager = (data) => {
    setOpenModal(true);
    setDetailsData(data);
  };

  const columns = [
    {
      title: "Manager",
      key: "manager",
      render: (_, manager) => (
        <div className="flex items-center gap-3">
          <img
            onClick={() => handleViewManager(manager)}
            src={`${import.meta.env.VITE_REACT_APP_BASE_URL}${manager?.uploadPhoto}`}
            alt={manager?.firstName}
            className="w-9 h-9 rounded-full object-cover cursor-pointer"
          />
          <span
            onClick={() => handleViewManager(manager)}
            className="text-[#e91e63] font-medium cursor-pointer hover:underline"
          >
            {manager?.firstName + " " + manager?.lastName}
          </span>
        </div>
      ),
    },
    {
      title: "ID#",
      dataIndex: "managerId",
      key: "managerId",
      render: (id) => <span className="text-gray-700">{id}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <span className="text-gray-700 truncate max-w-[180px] block">
          {email}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, manager) => (
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            manager?.isBlocked
              ? "bg-red-200 text-red-600"
              : "bg-green-100 text-green-700"
          }`}
        >
          {manager?.isBlocked ? "Blocked" : "Active"}
        </span>
      ),
    },
    {
      title: "Access",
      key: "access",
      align: "center",
      render: (_, manager) => (
        <LockOutlined
          className="text-[#e91e63] text-lg cursor-pointer hover:text-[#c2185b]"
          onClick={() => onOpenAccess(manager)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, manager) => (
        <div className="flex justify-center items-center gap-2">
          <Popconfirm
            title="Are you sure you want to delete this manager?"
            onConfirm={() => handleDeleteConfirm(manager._id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined className="cursor-pointer text-[#e91e63] text-md hover:text-[#c2185b]" />
          </Popconfirm>
          <button
            onClick={() => onDelete(manager?._id)}
            className="bg-[#e91e63] text-white px-3 py-1 text-xs rounded-md shadow hover:bg-[#d81b60] transition-all"
          >
            {manager?.isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-4">
      <div className="mb-4">
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type="text"
          placeholder="Search managers..."
          className="w-full border border-pink-200 rounded-md px-3 py-2 focus:outline-none focus:border-[#e91e63]"
        />
      </div>

      <Table
        columns={columns}
        dataSource={managers}
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: 800 }}
        pagination={false}
        rowClassName="border-b border-pink-100 hover:bg-pink-50 transition-all"
      />

      <UserDetailsModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        user={detailsData}
      />
    </div>
  );
};

export default ManagerList;
