
import { LockOutlined } from "@ant-design/icons";
import { ScaleLoader } from "react-spinners";

const ManagerList = ({ onDelete, onOpenAccess, managers, isLoading }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search managers..."
          className="w-full border border-pink-200 rounded-md px-3 py-2 focus:outline-none focus:border-[#e91e63]"
        />
      </div>

      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-pink-50 rounded-lg">
        <table className="min-w-[800px] w-full text-sm text-gray-700">
          <thead className="bg-pink-50 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Manager</th>
              <th className="px-6 py-3 text-left">ID#</th>
              <th className="px-6 py-3 text-left">Mail</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-center">Access</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {managers?.length > 0 ? (
              managers?.map((manager) => (
                <tr
                  key={manager._id}
                  className="border-b border-pink-100 hover:bg-pink-50 transition-all"
                >
                  <td className="px-6 py-3 flex items-center gap-3">
                    <img
                      src={
                        manager?.uploadPhoto ||
                        "https://avatar.iran.liara.run/public/job/police/male"
                      }
                      alt={manager?.firstName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span className="text-[#e91e63] font-medium cursor-pointer hover:underline">
                      {manager?.firstName + " " + manager?.lastName}
                    </span>
                  </td>

                  <td className="px-6 py-3">{manager.managerId}</td>
                  <td className="px-6 py-3 truncate max-w-[180px]">
                    {manager.email}
                  </td>

                  <td className="px-6 py-3">
                    <span
                      className={`${
                        manager?.isBlocked
                          ? "bg-red-200 text-red-600 text-xs px-3 py-1 rounded-full"
                          : "bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full"
                      }`}
                    >
                      {manager?.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  {/* 🔐 Access Button */}
                  <td className="px-6 py-3 text-center">
                    <LockOutlined
                      className="text-[#e91e63] text-lg cursor-pointer hover:text-[#c2185b]"
                      onClick={() => onOpenAccess(manager)}
                    />
                  </td>

                  <td className="px-6 py-3 text-right">
                    {/* Block/Unblock Button */}
                    <button
                      onClick={() => onDelete(manager?._id)} // Pass the manager's ID to the onDelete function
                      className="bg-[#e91e63] text-white px-3 py-1 text-xs rounded-md shadow hover:bg-[#d81b60] transition-all"
                    >
                      {manager?.isBlocked ? "Unblock" : "Block"}
                    </button>
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
                    "No Manager found"
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerList;
