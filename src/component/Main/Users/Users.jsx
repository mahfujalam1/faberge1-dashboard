import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import UserTable from "./UserTable";
import UserDetailsModal from "../../ui/Modals/UserDetailsModal";
import ConfirmationModal from "../../ui/Modals/ConfirmationModal";
import CreateWorkerModal from "../../ui/Modals/CreateWorkerModal";
import { allServices } from "../../../constants/service";
import WorkerTable from "./workerTable";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("worker");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // services -> string for table
  const generateServiceString = (selectedServices = []) =>
    selectedServices
      .map((srv) =>
        srv?.subServices?.length
          ? `${srv.name} (${srv.subServices.map((s) => s.name).join(" + ")})`
          : srv.name
      )
      .join(" + ");

  const handleAddNew = () => setIsCreateModalOpen(true);


  return (
    <div className="p-6 overflow-x-auto md:w-[420px] lg:w-[680px] xl:w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">User Management</h1>
      </div>

      {/* Tabs + Add Button */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-3 bg-white py-2 px-2 rounded-md shadow-sm border border-pink-100">
          <button
            onClick={() => setActiveTab("worker")}
            className={`px-4 font-medium ${
              activeTab === "worker"
                ? "text-[#e91e63] border-b-2 border-[#e91e63]"
                : "text-gray-700"
            }`}
          >
            Worker
          </button>
          <button
            onClick={() => setActiveTab("customer")}
            className={`px-4 font-medium ${
              activeTab === "customer"
                ? "text-[#e91e63] border-b-2 border-[#e91e63]"
                : "text-gray-700"
            }`}
          >
            Customer
          </button>
        </div>

        {activeTab === "worker" && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-[#e91e63] hover:bg-[#d81b60] border-none text-white font-medium"
            onClick={handleAddNew}
          >
            Add New
          </Button>
        )}
      </div>

      {activeTab === "customer" && (
        <>
          <UserTable type={activeTab} />
        </>
      )}

      {activeTab === "worker" && (
        <>
          <WorkerTable type={activeTab} />
        </>
      )}

      {/* Create Worker */}
      <CreateWorkerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        allServices={allServices}
      />
    </div>
  );
};

export default UserManagement;
