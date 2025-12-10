import React, { useState } from "react";
import { useGetAllBookingsQuery } from "../../../redux/features/booking/booking";
import { Button } from "antd";
import { ScaleLoader } from "react-spinners";

const Notifications = () => {
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
    <div className="min-h-screen p-6 overflow-x-auto md:w-[420px] lg:w-[680px] xl:w-full">
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-gray-800 mb-5">
        Notifications
      </h1>

      {/* Notifications Table */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-pink-50">
        <table className="min-w-[900px] w-full text-sm text-gray-700">
          <thead className="bg-pink-50 text-gray-700 uppercase text-sm font-bold">
            <tr>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Worker</th>
              <th className="px-6 py-3 text-left">Services</th>
              <th className="px-6 py-3 text-left">Payment Amount</th>
              <th className="px-6 py-3 text-left">TransactionId</th>
              <th className="px-6 py-3 text-right">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings?.length > 0 &&
              filteredBookings?.map((booking) => (
                <tr
                  key={booking?._id}
                  className="border-b border-gray-400 hover:bg-pink-50 transition-all text-sm"
                >
                  <td className="px-6 py-3">
                    {booking?.customer?.firstName +
                      " " +
                      booking?.customer?.lastName}
                  </td>
                  <td className="px-6 py-3">
                    {booking?.worker?.firstName +
                      " " +
                      booking?.worker?.lastName}
                  </td>
                  <td className="px-6 py-3">
                    {formatServices(booking?.services)}
                  </td>
                  <td className="px-6 py-3">${booking?.paymentAmount}</td>
                  <td className="px-6 py-3">{booking?.transactionId}</td>
                  <td className="px-6 py-3 text-right">
                    {formatDateTime(booking?.createdAt)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {isLoading && (
          <div className="flex items-center justify-center text-center py-5">
            <ScaleLoader color="#ff0db4" />
          </div>
        )}
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
      </div>
    </div>
  );
};

export default Notifications;
