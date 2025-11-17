import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import ConfirmationModal from "../../ui/Modals/ConfirmationModal";
import UserDetailsModal from "../../ui/Modals/UserDetailsModal"; // ✅ import modal

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
  const [bookings, setBookings] = useState(mockBookings);
  const [deleteId, setDeleteId] = useState(null);

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
    setBookings(bookings.filter((b) => b.id !== deleteId));
    setDeleteId(null);
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
        <div className="w-full divide-y divide-pink-100">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between py-3 hover:bg-pink-50 rounded-lg px-2 transition-all"
            >
              {/* Customer */}
              <div className="flex items-center gap-3 w-[160px] shrink-0">
                <img
                  src={booking.avatar}
                  alt={booking.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-[#e91e63] cursor-pointer hover:underline">
                    {booking.name}
                  </p>
                </div>
              </div>

              {/* Worker */}
              <div className="flex items-center gap-3 w-[180px] shrink-0">
                <img
                  src={booking.avatar}
                  alt={booking.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-[#e91e63] cursor-pointer hover:underline">
                    {booking.name}
                  </p>
                  <p className="text-xs text-gray-500">{booking.userId}</p>
                </div>
              </div>

              {/* Service */}
              <p className="text-sm text-gray-600 w-[200px] shrink-0">
                {booking.service}
              </p>

              {/* Date */}
              <p className="text-sm text-gray-600 w-[150px] shrink-0">
                {booking.date}
              </p>

              {/* Status */}
              <span className="text-xs bg-pink-100 text-[#e91e63] px-3 py-1 rounded-full font-medium w-[90px] text-center shrink-0">
                {booking.status}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-4 text-[#e91e63] w-[80px] justify-end shrink-0">
                <EyeOutlined
                  className="cursor-pointer hover:text-pink-500 text-lg"
                  onClick={() => handleView(booking)} // ✅ opens modal
                />
                <DeleteOutlined
                  className="cursor-pointer hover:text-red-500 text-lg"
                  onClick={() => handleDelete(booking.id)}
                />
              </div>
            </div>
          ))}
        </div>
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
