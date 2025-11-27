import { EyeOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";
import { useState } from "react";
import { useGetAllWorkersQuery } from "../../../redux/features/worker/worker";
import UserDetailsModal from "../../ui/Modals/UserDetailsModal";

const WorkerTable = () => {
  const [searchValue, setSearchValue] = useState(""); // Search term for filtering
  const [currentPage, setCurrentPage] = useState(1); // Page number for pagination
  const [openModal, setOpenModal] = useState(false); // Modal state for details
  const [detailsData, setDetailsData] = useState({}); // Store the details of selected worker

  // Define page size (limit)
  const limit = 8;

  // Fetch data based on search term, current page, and limit
  const { data, isLoading } = useGetAllWorkersQuery({
    page: currentPage,
    limit,
    searchTerm: searchValue,
  });
  const pagination = data?.pagination;

  const filteredData = data?.data;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleViewWorker = (data) => {
    setOpenModal(true);
    setDetailsData(data);
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-100 mt-4">
      <div className="p-5 border-b border-pink-100">
        <Input
          placeholder={`Search Workers...`}
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
              <th className="px-6 py-3 w-[200px]">Worker</th>
              <th className="px-6 py-3 w-[200px]">Title</th>
              <th className="px-6 py-3 w-[120px]">ID#</th>
              <th className="px-6 py-3 w-[160px]">Location</th>
              <th className="px-6 py-3 w-[240px]">Services</th>
              <th className="px-6 py-3 w-[120px]">Status</th>
              <th className="px-6 py-3 text-center w-[100px]">Actions</th>
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
                        user.uploadPhoto &&
                        user.uploadPhoto === "http://10.10.20.16:5137undefined"
                          ? "https://avatar.iran.liara.run/public/39"
                          : user.uploadPhoto
                      }
                      alt={user.firstName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span
                      className="text-[#e91e63] font-medium cursor-pointer hover:underline"
                      onClick={() => handleViewWorker(user)}
                    >
                      {user.firstName}
                    </span>
                  </td>

                  <td className="px-6 py-3 w-[120px]">
                    {user?.title || "Title"}
                  </td>
                  <td className="px-6 py-3 w-[120px]">{user.workerId}</td>
                  <td className="px-6 py-3 w-[160px]">{user.address}</td>
                  <td className="px-6 py-3 w-[240px]">
                    {user.services?.map((service) => (
                      <ul key={service?._id}>
                        <li>{service?.service?.serviceName}</li>
                      </ul>
                    ))}
                  </td>
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
                  <td className="px-6 py-3 text-right flex justify-center gap-4 text-[#e91e63]">
                    <EyeOutlined
                      className="cursor-pointer hover:text-pink-500 text-lg"
                      onClick={() => handleViewWorker(user)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No Workers found.
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
    </div>
  );
};

export default WorkerTable;
