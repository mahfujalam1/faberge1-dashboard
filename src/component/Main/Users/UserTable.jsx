import { EyeOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useState } from "react";
import { useGetAllUsersQuery } from "../../../redux/features/user/userApi";
import UserDetailsModal from "../../ui/Modals/UserDetailsModal";

const UserTable = () => {
  const { data } = useGetAllUsersQuery({ page: 1, limit: 10, sortBy: null });
  const userData = data?.data;
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [detailsData, setDetailsData] = useState({});

  const filteredData = userData?.filter((user) =>
    user.firstName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleViewCustomer = (data) => {
    setOpenModal(true);
    setDetailsData(data);
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
              <th className="px-6 py-3 text-right w-[100px]">Actions</th>
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
                      src={
                        user.uploadPhoto ||
                        "https://avatar.iran.liara.run/public/19"
                      }
                      alt={user.firstName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span
                      className="text-[#e91e63] font-medium cursor-pointer hover:underline"
                      onClick={() => onView(user)}
                    >
                      {user.firstName + " " + user?.lastName}
                    </span>
                  </td>

                  <td className="px-6 py-3 w-[160px]">{user.address}</td>
                  <td className="px-6 py-3 w-[240px]">{user.email}</td>
                  <td className="px-6 py-3 w-[160px]">{user.phone}</td>

                  {/* Actions */}
                  <td className="px-6 py-3 text-right flex justify-end gap-4 text-[#e91e63]">
                    <EyeOutlined
                      className="cursor-pointer hover:text-pink-500 text-lg"
                      onClick={() => handleViewCustomer(user)}
                    />
                    <DeleteOutlined
                      className="cursor-pointer hover:text-red-500 text-lg"
                      // onClick={() => onDelete(user)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={"customer" ? 6 : 5}
                  className="text-center py-6 text-gray-500"
                >
                  No Customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <UserDetailsModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        user={detailsData}
      />
    </div>
  );
};

export default UserTable;
