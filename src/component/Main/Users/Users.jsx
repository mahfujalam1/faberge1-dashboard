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

  // Workers (sample)
  const [workers, setWorkers] = useState([
    {
      id: 1,
      firstName: "Mahfuj",
      lastName: "Alam",
      address: "Dhaka, Mohakhali",
      zipCode: "1200",
      title: "Nail Tech",
      city: "Dhaka",
      state: "Bangladesh",
      email: "mahfujalam5795@gmail.com",
      phone: "67356345656",
      workerId: "4585694",
      password: "fasdfa",
      confirmPassword: "fasdfasdf",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      selectedServices: [
        {
          name: "Manicure",
          price: 25,
          subServices: [
            { id: 101, name: "Gel", price: 10, water: 5 },
            { id: 102, name: "Water", price: 7, water: 3 },
          ],
        },
      ],
      status: "active",
    },
  ]);

  // Customers (FLAT array)
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John S.",
      location: "New York, NY",
      email: "john.s@example.com",
      phone: "+1 (212) 555-0101",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      status: "active",
    },
    {
      id: 2,
      name: "Ayesha Rahman",
      location: "Dhaka, BD",
      email: "ayesha@example.com",
      phone: "+880 1712-345678",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      status: "active",
    },
  ]);


  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
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

  // Delete handlers (works for both tabs)
  const handleDeleteClick = (row) => {
    setUserToDelete({ ...row, __type: activeTab });
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    if (userToDelete.__type === "worker") {
      setWorkers((prev) => prev.filter((w) => w.id !== userToDelete.id));
    } else {
      setCustomers((prev) => prev.filter((c) => c.id !== userToDelete.id));
    }
    setConfirmModalOpen(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => setConfirmModalOpen(false);

  const handleAddNew = () => setIsCreateModalOpen(true);

  const handleSaveWorker = (workerData) => {
    const newWorker = { ...workerData, id: Date.now(), status: "active" };
    setWorkers((prev) => [...prev, newWorker]);
    setIsCreateModalOpen(false);
  };

  // Normalize data for table by tab
  const tableData =
    activeTab === "worker"
      ? workers.map((w) => ({
          id: w.id,
          name: `${w.firstName} ${w.lastName}`,
          workerId: w.workerId || "N/A",
          location: `${w.city}, ${w.state}`,
          services: generateServiceString(w.selectedServices),
          status: w.status || "active",
          zipCode: w.zipCode,
          title: w.title,
          email: w.email,
          phone: w.phone,
          avatar: w.image,
        }))
      : customers.map((c) => ({
          id: c.id,
          name: c.name,
          location: c.location,
          email: c.email,
          phone: c.phone,
          avatar: c.avatar,
          status: c.status || "active",
        }));

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



      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        title={
          userToDelete?.__type === "worker"
            ? "Delete Worker"
            : "Delete Customer"
        }
        message={
          userToDelete?.__type === "worker"
            ? `Are you sure you want to delete ${
                userToDelete?.name || "this worker"
              }?`
            : `Are you sure you want to delete ${
                userToDelete?.name || "this customer"
              }?`
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Create Worker */}
      <CreateWorkerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveWorker}
        allServices={allServices}
      />
    </div>
  );
};

export default UserManagement;
