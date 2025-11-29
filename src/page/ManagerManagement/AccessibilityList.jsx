import React, { useEffect, useState } from "react";
import {
  useGetAllAccessibilityQuery,
  useUpdateManagerAccessMutation,
} from "../../redux/features/superAdmin/super-admin";
import {
  FaChartBar,
  FaChartLine,
  FaUsers,
  FaCar,
  FaMoneyCheckAlt,
  FaTools,
  FaQuestionCircle,
  FaBell,
  FaUserShield,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserCircle,
  FaFileAlt,
  FaGavel,
} from "react-icons/fa";
import { toast } from "sonner";

// Complete module icons and labels matching sidebar (all with "Show")
const moduleMapping = {
  isDashboardShow: {
    label: "Dashboard",
    icon: <FaChartBar />,
  },
  isAnalyticsShow: {
    label: "Analytics",
    icon: <FaChartLine />,
  },
  isBookingManagementShow: {
    label: "Bookings",
    icon: <FaCalendarAlt />,
  },
  isTransactionsShow: {
    label: "Transactions",
    icon: <FaMoneyCheckAlt />,
  },
  isServicesShow: {
    label: "Services",
    icon: <FaCar />,
  },
  isUsersShow: {
    label: "Users",
    icon: <FaUsers />,
  },
  isStateShow: {
    label: "States",
    icon: <FaMapMarkerAlt />,
  },
  isHelpAndSupportShow: {
    label: "Notifications",
    icon: <FaBell />,
  },
  isProfileShow: {
    label: "Profile",
    icon: <FaUserCircle />,
  },
  isSiteContentShow: {
    label: "Site Content",
    icon: <FaFileAlt />,
  },
  isLegalitiesShow: {
    label: "Legalities",
    icon: <FaGavel />,
  },
};

const AccessibilityList = ({ managers }) => {
  const { data, isLoading, isError } = useGetAllAccessibilityQuery();
  const [updateManagerAccess] = useUpdateManagerAccessMutation();

  const [managerData, setManagerData] = useState(managers);

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
    return manager?.accessibility?.[moduleKey] ?? false;
  };

  // Handle the toggle action
  const handleToggleAccess = (managerId, moduleKey, newValue) => {
    // Optimistic UI Update
    const updatedManagers = managerData.map((manager) =>
      manager._id === managerId
        ? {
            ...manager,
            accessibility: {
              ...manager.accessibility,
              [moduleKey]: newValue,
            },
          }
        : manager
    );
    setManagerData(updatedManagers);

    // Prepare the data to update
    const data = { [moduleKey]: newValue };

    // Call the mutation
    updateManagerAccess({ managerId, data })
      .then((response) => {
        console.log("Access updated successfully:", response);
        toast.success(response?.data?.message);
      })
      .catch((error) => {
        console.error("Failed to update access:", error);
        toast.error("Failed to update accessibility");

        // Rollback
        const rollbackManagers = managerData.map((manager) =>
          manager._id === managerId
            ? {
                ...manager,
                accessibility: {
                  ...manager.accessibility,
                  [moduleKey]: !newValue,
                },
              }
            : manager
        );
        setManagerData(rollbackManagers);
      });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-4 overflow-y-auto max-h-72">
      <div className="flex flex-col divide-y divide-pink-100">
        {Object.entries(moduleMapping).map(([key, { label, icon }]) => {
          const isActive = getManagerAccess(managerData[0], key);

          return (
            // Render the module toggle only if it exists in accessibility
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
                    }
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
