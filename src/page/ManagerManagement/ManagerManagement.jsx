import React, { useState } from "react";
import ManagerList from "./ManagerList";
import AccessModal from "../../component/ui/Modals/AccessModal";
import CreateManagerModal from "../../component/ui/Modals/CreateManagerModal";
import {
  useGetAllManagersQuery,
  useCreateManagerMutation,
  useUpdateManagerAccessMutation,
  useDeleteManagerMutation,
} from "../../redux/features/superAdmin/super-admin";

const ManagerManagement = () => {
  const [selectedManager, setSelectedManager] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch all managers from the backend
  const { data, isLoading, isError } = useGetAllManagersQuery();
  const managers = data?.data;

  // Hooks for mutation
  const [createManager] = useCreateManagerMutation();
  const [updateManagerAccess] = useUpdateManagerAccessMutation();
  const [deleteManager] = useDeleteManagerMutation();

  // 🗑️ Delete Manager
  const handleDeleteManager = async (managerId) => {
    try {
      await deleteManager(managerId); // Delete manager via RTK Query API
    } catch (error) {
      console.error("Failed to delete manager", error);
    }
  };

  // 🔐 Access Modal
  const handleOpenAccess = (manager) => setSelectedManager(manager);
  const handleCloseAccess = () => setSelectedManager(null);

  // ⚙️ Toggle access
  const handleToggleAccess = async (managerId, moduleName, value) => {
    try {
      await updateManagerAccess({
        managerId,
        accessData: { [moduleName]: value },
      });
      // If access updated successfully, update UI accordingly
      setSelectedManager((prev) => ({
        ...prev,
        access: { ...prev.access, [moduleName]: value },
      }));
    } catch (error) {
      console.error("Failed to update access", error);
    }
  };

  // ➕ Add new manager
  const handleAddManager = async (newManagerData) => {
    try {
      await createManager(newManagerData); // Create manager via RTK Query API
      setShowCreateModal(false); // Close modal after creation
    } catch (error) {
      console.error("Failed to create manager", error);
    }
  };


  return (
    <div className="p-6 min-h-screen overflow-x-auto md:w-[420px] lg:w-[680px] xl:w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Managers</h1>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#e91e63] text-white px-4 py-2 rounded-md shadow hover:bg-[#d81b60] transition-all"
        >
          + Add New
        </button>
      </div>

      <ManagerList
      isLoading={isLoading}
        managers={managers}
        onDelete={handleDeleteManager} // Directly delete when button is clicked
        onOpenAccess={handleOpenAccess}
      />

      {/* 🔐 Access Modal */}
      {selectedManager && (
        <AccessModal
          isOpen={!!selectedManager}
          manager={selectedManager}
          onClose={handleCloseAccess}
          onToggleAccess={handleToggleAccess}
        />
      )}

      {/* ➕ Create Manager Modal */}
      {showCreateModal && (
        <CreateManagerModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleAddManager}
        />
      )}
    </div>
  );
};

export default ManagerManagement;
