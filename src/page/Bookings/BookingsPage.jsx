import { EyeOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Button, Popconfirm } from "antd";
import { useState } from "react";
import BookingDetailsModal from "../../component/ui/Modals/BookingDetailsModal";
import {
  useDeleteBookingMutation,
  useGetAllBookingsQuery,
} from "../../redux/features/booking/booking";
import { ScaleLoader } from "react-spinners";
import { toast } from "sonner";

const BookingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const limit = 10;
  const { data, isLoading } = useGetAllBookingsQuery({
    page: currentPage,
    limit,
    status: "",
  });
  const bookings = data?.data;
  const pagination = data?.pagination;

  const [deleteBooking] = useDeleteBookingMutation();

  // Filter to show only booked and completed bookings, then apply search filter
  const filteredBookings = bookings
    ?.filter((b) => b.status === "booked" || b.status === "completed") // Only show booked and completed
    ?.filter((b) =>
      b.customer?.firstName.toLowerCase().includes(searchValue.toLowerCase())
    );

  // Format date and convert 24-hour time to 12-hour format
  const formatDateTime = (dateString, startTime) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    // Convert startTime (e.g., "14:00") to 12-hour format
    let formattedTime = "N/A";
    if (startTime) {
      const [hours, minutes] = startTime.split(":");
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12; // Convert 0 to 12 for midnight
      formattedTime = `${hour12}:${minutes} ${period}`;
    }

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

  const handleDeleteBooking = async (bookingId) => {
    const res = await deleteBooking(bookingId);
    if (res?.data?.success) {
      toast.success("Booking deleted successfully");
    } else if (res?.error) {
      toast.error("Failed to delete booking");
    }
  };

  return (
    <div className="p-6 overflow-x-auto md:w-[420px] lg:w-[680px] xl:w-full">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">All Bookings</h1>

      <div className="bg-white rounded-xl shadow-sm border border-pink-100 mt-4">
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
                          src={`${import.meta.env.VITE_REACT_APP_BASE_URL}${
                            booking?.customer?.uploadPhoto
                          }`}
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
                      {formatDateTime(booking?.date, booking?.startTime)}
                    </td>

                    <td className="px-6 py-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          booking.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "booked"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {booking?.status}
                      </span>
                    </td>

                    <td className="px-6 py-3 text-right text-[#e91e63]">
                      <div className="flex justify-center gap-4">
                        <EyeOutlined
                          className="cursor-pointer hover:text-pink-500 text-lg"
                          onClick={() => handleView(booking)}
                        />
                        <Popconfirm
                          title="Are you sure you want to delete this booking?"
                          onConfirm={() => handleDeleteBooking(booking._id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <DeleteOutlined className="cursor-pointer hover:text-pink-500 text-lg" />
                        </Popconfirm>
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
