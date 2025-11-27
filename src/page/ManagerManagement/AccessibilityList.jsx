import React, { useEffect, useState } from "react";
import {
  useGetAllAccessibilityQuery,
  useUpdateManagerAccessMutation,
} from "../../redux/features/superAdmin/super-admin"; // Importing the mutation hook
import {
  FaChartBar,
  FaChartLine,
  FaUsers,
  FaCar,
  FaMoneyCheckAlt,
  FaTools, // Add new icons if necessary
  FaQuestionCircle, // Add for Help and Support
} from "react-icons/fa";
import { toast } from "sonner";

// Default module icons and labels
const moduleMapping = {
  isDashboardShow: {
    label: "Dashboard",
    icon: <FaChartBar />,
  },
  isAnalyticsShow: {
    label: "Analytics",
    icon: <FaChartLine />,
  },
  isUsersShow: {
    label: "Users",
    icon: <FaUsers />,
  },
  isServicesShow: {
    label: "Services",
    icon: <FaCar />,
  },
  isTransactionsShow: {
    label: "Transactions",
    icon: <FaMoneyCheckAlt />,
  },
  isHelpAndSupport: {
    label: "Help & Support",
    icon: <FaQuestionCircle />,
  },
  isBookingManagement: {
    label: "Booking Management",
    icon: <FaTools />,
  },
};

const AccessibilityList = ({ managers }) => {
  const { data, isLoading, isError } = useGetAllAccessibilityQuery(); // Fetch accessibility data dynamically
  const [updateManagerAccess] = useUpdateManagerAccessMutation(); // Mutation to update the manager's accessibility

  const [managerData, setManagerData] = useState(managers); // Store manager data locally

  useEffect(() => {
    if (isError) {
      console.error("Error fetching accessibility data");
    }
  }, [isError]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data?.data) {
    return <div>Error loading accessibility data</div>;
  }

  // Function to get the manager's access to a specific module
  const getManagerAccess = (manager, moduleKey) => {
    return manager?.accessibility?.[moduleKey] ?? false; // Default to false if undefined
  };

  // Handle the toggle action: This sends the updated access status to the backend
  const handleToggleAccess = (managerId, moduleKey, newValue) => {
    // Optimistic UI Update: Immediately reflect the change in the UI
    const updatedManagers = managerData.map((manager) =>
      manager._id === managerId
        ? {
            ...manager,
            accessibility: {
              ...manager.accessibility,
              [moduleKey]: newValue, // Update the specific module access
            },
          }
        : manager
    );
    setManagerData(updatedManagers); // Update local state immediately

    // Prepare the data to update
    const data = { [moduleKey]: newValue };

    // Call the mutation to update the manager's access on the backend
    const res = updateManagerAccess({ managerId, data })
      .then((response) => {
        console.log("Access updated successfully:", response);
        toast.success(response?.data?.message);
      })
      .catch((error) => {
        console.error("Failed to update access:", error);
        toast.error("Failed to update accessibility");

        // Rollback the optimistic update if the request fails
        const rollbackManagers = managerData.map((manager) =>
          manager._id === managerId
            ? {
                ...manager,
                accessibility: {
                  ...manager.accessibility,
                  [moduleKey]: !newValue, // Revert the access change
                },
              }
            : manager
        );
        setManagerData(rollbackManagers); // Rollback the local state update
      });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-4 overflow-y-auto max-h-72">
      <div className="flex flex-col divide-y divide-pink-100">
        {Object.entries(moduleMapping).map(([key, { label, icon }]) => {
          const isActive = getManagerAccess(managerData[0], key); // Check if the module is enabled for the current manager

          return (
            // Render the module toggle only if the module exists in the manager's accessibility object
            data?.data[key] !== undefined && (
              <div
                key={key}
                className="flex justify-between items-center py-3 px-4 hover:bg-pink-50 rounded-md transition-all"
              >
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="text-lg text-[#e91e63]">{icon}</span>
                  <p className="font-medium">{label}</p>
                </div>

                {/* Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) =>
                      handleToggleAccess(
                        managerData[0]?._id,
                        key,
                        e.target.checked
                      )
                    } // Pass manager._id and the updated value
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-[#e91e63] transition-all"></div>
                  <div className="absolute left-1 top-[3px] w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></div>
                </label>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default AccessibilityList;
