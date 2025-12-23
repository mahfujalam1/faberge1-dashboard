import { CloseOutlined } from "@ant-design/icons";
import { useToggleBlockUnblockMutation } from "../../../redux/features/customer-or-worker/customer-worker";
import { toast } from "sonner";
import { useState } from "react";

const UserDetailsModal = ({ isOpen, user, type, onClose }) => {
  if (!isOpen) return null;
  console.log(user);

  const [toggleBlock] = useToggleBlockUnblockMutation();
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [buttonText, setButtonText] = useState(
    user?.isDeleted ? "Unblock" : "Block"
  ); // Initial text based on user state

  const handleBlock = async (id) => {
    try {
      setIsLoading(true); // Start loading
      const res = await toggleBlock(id); // Perform the block/unblock action
      console.log("response =>", res);

      if (res?.data?.message) {
        toast.success(res?.data?.message); // Show success toast
        onClose(); // Close the modal after success
      }
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      toast.error("Error blocking/unblocking user");
    } finally {
      setIsLoading(false); // End loading
    }
  };

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
        </div>

        {/* Profile Image + Name */}
        <div className="flex flex-col items-center mb-5">
          <img
            src={
              user.uploadPhoto &&
              user.uploadPhoto === "http://10.10.20.16:5137undefined"
                ? "https://avatar.iran.liara.run/public/39"
                : user.uploadPhoto
            }
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
            <span className="font-medium text-gray-600">Name</span>
            <span>{user?.firstName + " " + user?.lastName || "example"}</span>
          </div>
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
                <span>{user?.role}</span>
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
                <span className="font-medium text-gray-600">Email:</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">
                  User Type / Title:{" "}
                </span>
                <span>Worker / {user.title || "Nail Tech"}</span>
              </div>
              <div className="flex justify-between">
                <span className="block font-medium text-gray-600 mb-1">
                  Skills:
                </span>
                <div className="flex flex-wrap gap-2">
                  {user?.services?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs bg-pink-100 text-[#e91e63] rounded-full border border-pink-200"
                    >
                      {skill?.service?.serviceName}
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
            onClick={() => handleBlock(user?._id)}
            className={`${
              isLoading ? "bg-gray-400" : "bg-[#e91e63]"
            } text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-all font-medium w-full`}
          >
            {isLoading ? (
              <div className="animate-spin border-t-2 border-b-2 border-white w-4 h-4 rounded-full mx-auto"></div> // Spinner while loading
            ) : user?.isBlocked ? (
              "Blocked" // Show "Blocked" text if user is blocked
            ) : (
              "Block" // Show "Block" text by default
            )}
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
