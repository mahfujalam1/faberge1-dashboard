
import { CloseOutlined } from "@ant-design/icons";

const UserDetailsModal = ({ isOpen, user, type, onClose, onAction }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] transition-all">
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-8 animate-fadeIn border border-pink-100">
        {/* 🔹 Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-[#e91e63] transition-all"
          aria-label="Close"
        >
          <CloseOutlined className="text-lg" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {user?.role === "worker" ? "Worker Details" : "Customer Details"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            See all details about{" "}
            <span className="font-medium">{user?.name}</span>
          </p>
        </div>

        {/* Profile Image + Name */}
        <div className="flex flex-col items-center mb-5">
          <img
            src={user?.uploadPhoto || "https://avatar.iran.liara.run/public/19"}
            alt={user?.firstName}
            className="w-24 h-24 rounded-full object-cover border-4 border-pink-100 shadow-sm mb-3"
          />
          <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
          {type === "worker" && (
            <p className="text-sm text-gray-500">ID #{user?.workerId}</p>
          )}
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 mb-6">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Address:</span>
            <span>{user?.address || "New York"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">City:</span>
            <span>{user?.city || "New York"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">State:</span>
            <span>{user?.state || "New York"}</span>
          </div>

          {user?.role === "customer" && (
            <>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Email:</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Phone:</span>
                <span>{user?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">User Type</span>
                <span>Customer</span>
              </div>
            </>
          )}

          {user?.role === "worker" && (
            <>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">ZipCode: </span>
                <span>{user?.zipCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">
                  User Type / Title:{" "}
                </span>
                <span>Worker / {user.title || "Nail Tech"}</span>
              </div>
              <div>
                <span className="block font-medium text-gray-600 mb-1">
                  Skills:
                </span>
                <div className="flex flex-wrap gap-2">
                  {user?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs bg-pink-100 text-[#e91e63] rounded-full border border-pink-200"
                    >
                      Padicure, Manicure
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => onAction(user)}
            className="bg-[#e91e63] text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-all font-medium w-full"
          >
            Block
          </button>
          <button
            onClick={onClose}
            className="border border-[#e91e63] text-[#e91e63] px-6 py-2 rounded-md hover:bg-pink-50 transition-all font-medium w-full"
          >
            {type === "worker" ? "Edit" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
