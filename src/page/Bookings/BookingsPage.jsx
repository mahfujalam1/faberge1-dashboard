import { EyeOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";
import { useState } from "react";
import BookingDetailsModal from "../../component/ui/Modals/BookingDetailsModal";
import { useGetAllBookingsQuery } from "../../redux/features/booking/booking";
import { ScaleLoader } from "react-spinners";

const BookingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1); // State to hold the current page
  const [searchValue, setSearchValue] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch data based on current page and search value
  const limit = 10;
  const { data, isLoading } = useGetAllBookingsQuery({
    page: currentPage,
    limit,
    status: "",
  });
  const bookings = data?.data;
  const pagination = data?.pagination;
  console.log(bookings);

  const filteredBookings = bookings?.filter((b) =>
    b.customer?.firstName.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${formattedDate}, ${formattedTime}`;
  };

  // Format services display
  const formatServices = (services) => {
    if (!services || services.length === 0) return "N/A";

    return services
      .map((serviceItem) => {
        const mainService =
          serviceItem.service?.serviceName || "Unknown Service";
        const subServices = serviceItem.subcategories
          ?.map((sub) => sub.subcategoryName)
          .join(", ");

        return subServices ? `${mainService} (${subServices})` : mainService;
      })
      .join(" | ");
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Pagination logic
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (bookings?.length === limit) {
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
    <div className="p-6 overflow-x-auto md:w-[420px] lg:w-[680px] xl:w-full">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">All Bookings</h1>

      <div className="bg-white rounded-xl shadow-sm border border-pink-100 mt-4">
        {/* <div className="p-5 border-b border-pink-100">
          <Input
            placeholder="Search bookings..."
            prefix={<SearchOutlined className="text-[#e91e63]" />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border border-pink-200 rounded-md py-3 focus:border-[#e91e63] focus:shadow-md"
          />
        </div> */}

        {/* 🧾 Table */}
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-pink-50">
          <table className="min-w-[900px] w-full text-sm text-left text-gray-700">
            <thead className="bg-pink-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 w-[200px]">Customer</th>
                <th className="px-6 py-3 w-[200px]">Worker</th>
                <th className="px-6 py-3 w-[250px]">Service</th>
                <th className="px-6 py-3 w-[180px]">Date & Time</th>
                <th className="px-6 py-3 w-[120px]">Status</th>
                <th className="px-6 py-3 text-center w-[100px]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings?.length > 0 ? (
                filteredBookings?.map((booking) => (
                  <tr
                    key={booking?._id}
                    className="border-b border-pink-100 hover:bg-pink-50 transition-all"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            booking?.customer?.uploadPhoto ||
                            "https://avatar.iran.liara.run/public/19"
                          }
                          alt={booking?.customer?.firstName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <p className="text-sm font-semibold text-[#e91e63] cursor-pointer hover:underline">
                          {booking?.customer?.firstName +
                            " " +
                            booking?.customer?.lastName}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-700">
                          {booking?.worker?.firstName +
                            " " +
                            booking?.worker?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.worker?.workerId}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-3 text-gray-600">
                      <div className="text-sm">
                        {formatServices(booking.services)}
                      </div>
                    </td>

                    <td className="px-6 py-3 text-gray-600">
                      {formatDateTime(booking.createdAt)}
                    </td>

                    <td className="px-6 py-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          booking.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {booking.status === "expired"
                          ? "pending"
                          : booking?.status}
                      </span>
                    </td>

                    <td className="px-6 py-3 text-right text-[#e91e63]">
                      <div className="flex justify-center gap-4">
                        <EyeOutlined
                          className="cursor-pointer hover:text-pink-500 text-lg"
                          onClick={() => handleView(booking)}
                        />
                      </div>
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
                      "No bookings found"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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

        <BookingDetailsModal
          isOpen={!!selectedBooking}
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      </div>
    </div>
  );
};

export default BookingsPage;
