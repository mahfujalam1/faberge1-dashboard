import {
  EyeOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Input, Button, Popconfirm } from "antd";
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
  const [searchValue, setSearchValue] = useState(""); // Search term for filtering
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [openModal, setOpenModal] = useState(false); // Modal state for user details
  const [openUpdateModal, setOpenUpdateModal] = useState(false); // Modal state for update
  const [detailsData, setDetailsData] = useState({}); // Store the details of selected user
  const [updateData, setUpdateData] = useState({}); // Store the data for updating user

  const [deleteUser] = useDeleteUserMutation(); // Hook for deleting a user

  const limit = 8; // Define the page size (limit)

  // Fetch data based on page, limit, and search term
  const { data, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    limit,
    searchTerm: searchValue,
  });
  const pagination = data?.pagination;
  const filteredData = data?.data;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewCustomer = (data) => {
    setOpenModal(true);
    setDetailsData(data);
  };

  const handleEditCustomer = (data) => {
    setOpenUpdateModal(true);
    setUpdateData(data);
  };

  // Pagination logic
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (filteredData?.length === limit) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPageButtons = () => {
    let buttons = [];
    for (let i = 1; i <= pagination?.totalPages; i++) {
      buttons.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${
            currentPage === i
              ? "bg-pink-500 text-white"
              : "bg-white text-pink-500 border-pink-500"
          }`}
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  const handleDeleteUser = async (userId) => {
    const res = await deleteUser(userId);
    if (res?.data.data) {
      toast.success(res?.data?.message);
    } else if (res?.data?.error) {
      toast.error(res?.error?.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-100 mt-4">
      <div className="p-5 border-b border-pink-100">
        <Input
          placeholder={`Search customers...`}
          prefix={<SearchOutlined className="text-[#e91e63]" />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="border border-pink-200 rounded-md py-3 focus:border-[#e91e63] focus:shadow-md"
        />
      </div>

      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-pink-50">
        <table className="min-w-[900px] w-full text-sm text-left text-gray-700">
          <thead className="bg-pink-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 w-[200px]">Customer</th>
              <th className="px-6 py-3 w-[160px]">Location</th>
              <th className="px-6 py-3 w-[240px]">Email</th>
              <th className="px-6 py-3 w-[160px]">Phone</th>
              <th className="px-6 py-3 w-[160px]">Status</th>
              <th className="px-6 py-3 text-center w-[140px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredData?.length > 0 ? (
              filteredData?.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-pink-50 border-b border-pink-100 transition-all"
                >
                  {/* Avatar + Name */}
                  <td className="px-6 py-3 flex items-center gap-3 w-[200px] shrink-0">
                    <img
                      src={`${import.meta.env.VITE_REACT_APP_BASE_URL}${
                        user?.uploadPhoto
                      }`}
                      alt={user.firstName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span
                      className="text-[#e91e63] font-medium cursor-pointer hover:underline"
                      onClick={() => handleViewCustomer(user)}
                    >
                      {user.firstName + " " + user?.lastName}
                    </span>
                  </td>

                  <td className="px-6 py-3 w-[160px]">{user.address}</td>
                  <td className="px-6 py-3 w-[240px]">{user.email}</td>
                  <td className="px-6 py-3 w-[160px]">{user.phone}</td>
                  <td className="px-6 py-3 w-[120px]">
                    <span
                      className={`${
                        user?.isBlocked
                          ? "bg-red-200 text-red-600 text-xs px-3 py-1 rounded-full"
                          : "bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full"
                      }`}
                    >
                      {user?.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3 text-right flex justify-center gap-3 text-[#e91e63]">
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
                      onConfirm={() => handleDeleteUser(user._id)} // Call delete function on confirmation
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined className="cursor-pointer hover:text-pink-500 text-lg" />
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
                  {isLoading ? (
                    <div className="flex items-center justify-center text-center">
                      <ScaleLoader color="#ff0db4" />
                    </div>
                  ) : (
                    "No Customer found"
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 py-4">
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-pink-500 text-white"
        >
          Previous
        </Button>

        {/* Dynamic page number buttons */}
        <div className="flex space-x-2">{renderPageButtons()}</div>

        <Button
          onClick={handleNextPage}
          disabled={currentPage === pagination?.totalPages}
          className="bg-pink-500 text-white"
        >
          Next
        </Button>
      </div>

      {/* Details Modal */}
      <UserDetailsModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        user={detailsData}
      />

      {/* Update Modal */}
      <UpdateCustomerModal
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        userData={updateData}
      />
    </div>
  );
};

export default UserTable;
