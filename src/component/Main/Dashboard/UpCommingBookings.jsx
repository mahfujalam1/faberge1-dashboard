import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import ConfirmationModal from "../../ui/Modals/ConfirmationModal";
import UserDetailsModal from "../../ui/Modals/UserDetailsModal"; // ✅ import modal
import { useGetUpcomingBookingsQuery } from "../../../redux/features/dashboard/dashboardApi";

const mockBookings = [
  {
    id: 1,
    name: "John S.",
    userId: "ID# 6592",
    service: "Mani, Pedi, Water, Gel",
    date: "10/12/2025, 10 AM",
    status: "Upcoming",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 2,
    name: "John S.",
    userId: "ID# 6592",
    service: "Mani, Pedi, Water, Gel",
    date: "10/12/2025, 10 AM",
    status: "Upcoming",
    avatar: "https://randomuser.me/api/portraits/women/66.jpg",
  },
  {
    id: 3,
    name: "John S.",
    userId: "ID# 6592",
    service: "Mani, Pedi, Water, Gel",
    date: "10/12/2025, 10 AM",
    status: "Upcoming",
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
  },
];

const UpcomingBooking = () => {
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const { data } = useGetUpcomingBookingsQuery();
  const bookings = data?.data;

  // ✅ for viewing user details
  const [selectedUser, setSelectedUser] = useState(null);

  const handleView = (booking) => {
    // open modal with selected booking info
    setSelectedUser(booking);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    // setBookings(bookings.filter((b) => b.id !== deleteId));
    setDeleteId(null);
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
                        src={
                          booking.uploadPhoto ||
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
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        booking.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-right text-[#e91e63]">
                    <div className="flex justify-end gap-4">
                      <EyeOutlined
                        className="cursor-pointer hover:text-pink-500 text-lg"
                        onClick={() => handleView(booking)}
                      />
                      <DeleteOutlined
                        className="cursor-pointer hover:text-red-500 text-lg"
                        onClick={() => handleDelete(booking.id)}
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
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ View User Details Modal */}
      <UserDetailsModal
        isOpen={!!selectedUser}
        user={selectedUser}
        type="customer"
        onClose={() => setSelectedUser(null)}
        onAction={(user) => {
          console.log("Action performed for:", user.name);
          setSelectedUser(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteId}
        title="Delete Booking"
        message="Are you sure you want to delete this booking?"
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default UpcomingBooking;
