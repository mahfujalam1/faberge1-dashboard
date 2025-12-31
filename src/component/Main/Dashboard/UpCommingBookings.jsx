import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useGetUpcomingBookingsQuery } from "../../../redux/features/dashboard/dashboardApi";
import BookingDetailsModal from "../../ui/Modals/BookingDetailsModal";
import { ScaleLoader } from "react-spinners";

const UpcomingBooking = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetUpcomingBookingsQuery();
  const bookings = data?.data;

  // ✅ for viewing user details
  const [selectedUser, setSelectedUser] = useState(null);

  const handleView = (booking) => {
    // open modal with selected booking info
    setSelectedUser(booking);
  };

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-4 pe-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-pink-100 border-b pb-2">
        <h3 className="text-md font-semibold text-gray-800">
          Upcoming Bookings
        </h3>
        <button
          onClick={() => navigate("/bookings")}
          className="text-sm text-[#e91e63] hover:underline"
        >
          See All
        </button>
      </div>

      {/* Responsive Scroll Container */}
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-pink-50">
        <table className="w-full divide-y divide-pink-100">
          <tbody>
            {bookings?.length > 0 ? (
              bookings?.map((booking) => (
                <tr
                  key={booking._id}
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
                        {booking.worker?._id}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-3 text-gray-600">
                    <div className="text-sm">
                      {formatServices(booking.services)}
                    </div>
                  </td>

                  <td className="px-6 py-3 text-gray-600">
                    {formatDateTime(booking.date)}
                  </td>

                  <td className="px-6 py-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700}`}
                    >
                      Booked
                    </span>
                  </td>

                  <td className="px-6 py-3 text-right text-[#e91e63]">
                    <div className="flex justify-end gap-4">
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
                    "No Upcoming Booking found"
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ View User Details Modal */}

      <BookingDetailsModal
        isOpen={!!selectedUser}
        booking={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default UpcomingBooking;
