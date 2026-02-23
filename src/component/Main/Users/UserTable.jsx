import {
  EyeOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Input, Button, Popconfirm, Table } from "antd";
import { useState } from "react";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "../../../redux/features/user/userApi";
import UserDetailsModal from "../../ui/Modals/UserDetailsModal";
import UpdateCustomerModal from "../../ui/Modals/UpdateCustomerModal";
import { ScaleLoader } from "react-spinners";
import { toast } from "sonner";

const UserTable = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const [updateData, setUpdateData] = useState({});

  const [deleteUser] = useDeleteUserMutation();

  const limit = 8;

  const { data, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    limit,
    searchTerm: searchValue,
  });
  const pagination = data?.pagination;
  const filteredData = data?.data;

  const handleViewCustomer = (data) => {
    setOpenModal(true);
    setDetailsData(data);
  };

  const handleEditCustomer = (data) => {
    setOpenUpdateModal(true);
    setUpdateData(data);
  };

  const handleDeleteUser = async (userId) => {
    const res = await deleteUser(userId);
    if (res?.data?.data) {
      toast.success(res?.data?.message);
    } else if (res?.data?.error) {
      toast.error(res?.error?.message);
    }
  };

  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (_, user) => (
        <div className="flex items-center gap-3">
          <img
            src={`${import.meta.env.VITE_REACT_APP_BASE_URL}${user?.uploadPhoto}`}
            alt={user.firstName}
            className="w-9 h-9 rounded-full object-cover"
          />
          <span
            className="text-[#e91e63] font-medium cursor-pointer hover:underline"
            onClick={() => handleViewCustomer(user)}
          >
            {user.firstName + " " + user?.lastName}
          </span>
        </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "address",
      key: "address",
      render: (address) => <span className="text-gray-700">{address}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <span className="text-gray-700">{email}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => <span className="text-gray-700">{phone}</span>,
    },
    {
      title: "Status",
      key: "status",
      render: (_, user) => (
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            user?.isBlocked
              ? "bg-red-200 text-red-600"
              : "bg-green-100 text-green-700"
          }`}
        >
          {user?.isBlocked ? "Blocked" : "Active"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, user) => (
        <div className="flex justify-center gap-3 text-[#e91e63]">
          <EyeOutlined
            className="cursor-pointer hover:text-pink-500 text-lg"
            onClick={() => handleViewCustomer(user)}
          />
          <EditOutlined
            className="cursor-pointer hover:text-pink-500 text-lg"
            onClick={() => handleEditCustomer(user)}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteUser(user._id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined className="cursor-pointer hover:text-pink-500 text-lg" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-100 mt-4">
      <div className="p-5 border-b border-pink-100">
        <Input
          placeholder="Search customers..."
          prefix={<SearchOutlined className="text-[#e91e63]" />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="border border-pink-200 rounded-md py-3 focus:border-[#e91e63] focus:shadow-md"
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: 900 }}
        pagination={{
          current: currentPage,
          pageSize: limit,
          total: pagination?.total,
          position: ["bottomCenter"],
          onChange: (page) => setCurrentPage(page),
          showSizeChanger: false,
          itemRender: (page, type, originalElement) => {
            if (type === "prev") {
              return (
                <Button className="bg-pink-500 text-white border-none">
                  Previous
                </Button>
              );
            }
            if (type === "next") {
              return (
                <Button className="bg-pink-500 text-white border-none">
                  Next
                </Button>
              );
            }
            if (type === "page") {
              return (
                <Button
                  className={
                    currentPage === page
                      ? "bg-pink-500 text-white border-none"
                      : "bg-white text-pink-500 border-pink-500"
                  }
                >
                  {page}
                </Button>
              );
            }
            return originalElement;
          },
        }}
        rowClassName="border-b border-pink-100 hover:bg-pink-50 transition-all"
      />

      <UserDetailsModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        user={detailsData}
      />
      <UpdateCustomerModal
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        userData={updateData}
      />
    </div>
  );
};

export default UserTable;
