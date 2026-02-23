import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Input, Button, Popconfirm, Table } from "antd";
import { useState } from "react";
import {
  useDeleteWorkerMutation,
  useGetAllWorkersQuery,
} from "../../../redux/features/worker/worker";
import UserDetailsModal from "../../ui/Modals/UserDetailsModal";
import { ScaleLoader } from "react-spinners";
import { toast } from "sonner";
import UpdateWorkerModal from "../../ui/Modals/UpdateWorkerModal";

const WorkerTable = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const [updateData, setUpdateData] = useState({});

  const [deleteWorker] = useDeleteWorkerMutation();

  const limit = 8;

  const { data, isLoading } = useGetAllWorkersQuery({
    page: currentPage,
    limit,
    searchTerm: searchValue,
  });
  const pagination = data?.pagination;
  const filteredData = data?.data;

  const handleViewWorker = (data) => {
    setOpenModal(true);
    setDetailsData(data);
  };

  const handleEditWorker = (data) => {
    setOpenUpdateModal(true);
    setUpdateData(data);
  };

  const handleDeleteWorker = async (workerId) => {
    const res = await deleteWorker(workerId);
    if (res?.data?.data) {
      toast.success(res?.data?.message);
    } else if (res?.data?.error) {
      toast.error(res?.error?.message);
    }
  };

  const columns = [
    {
      title: "Worker",
      key: "worker",
      render: (_, worker) => (
        <div className="flex items-center gap-3">
          <img
            src={`${import.meta.env.VITE_REACT_APP_BASE_URL}${worker?.uploadPhoto}`}
            alt={worker?.firstName}
            className="w-9 h-9 rounded-full object-cover"
          />
          <span
            className="text-[#e91e63] font-medium cursor-pointer hover:underline"
            onClick={() => handleViewWorker(worker)}
          >
            {worker?.firstName + " " + worker?.lastName}
          </span>
        </div>
      ),
    },
    {
      title: "Title",
      key: "title",
      render: (_, worker) => (
        <span className="text-gray-700">{worker?.title || "Title"}</span>
      ),
    },
    {
      title: "ID#",
      dataIndex: "workerId",
      key: "workerId",
      render: (id) => <span className="text-gray-700">{id}</span>,
    },
    {
      title: "Location",
      dataIndex: "address",
      key: "address",
      render: (address) => <span className="text-gray-700">{address}</span>,
    },
    {
      title: "Services",
      key: "services",
      render: (_, worker) => (
        <ul className="list-none m-0 p-0">
          {worker?.services?.map((service) => (
            <li key={service?._id}>{service?.service?.serviceName}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, worker) => (
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            worker?.isBlocked
              ? "bg-red-200 text-red-600"
              : "bg-green-100 text-green-700"
          }`}
        >
          {worker?.isBlocked ? "Blocked" : "Active"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, worker) => (
        <div className="flex justify-center gap-3 text-[#e91e63]">
          <EyeOutlined
            className="cursor-pointer hover:text-pink-500 text-lg"
            onClick={() => handleViewWorker(worker)}
          />
          <EditOutlined
            className="cursor-pointer hover:text-pink-500 text-lg"
            onClick={() => handleEditWorker(worker)}
          />
          <Popconfirm
            title="Are you sure you want to delete this worker?"
            onConfirm={() => handleDeleteWorker(worker._id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined className="cursor-pointer hover:text-pink-500 text-lg" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-100 mt-4">
      <div className="p-5 border-b border-pink-100">
        <Input
          placeholder="Search Workers..."
          prefix={<SearchOutlined className="text-[#e91e63]" />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="border border-pink-200 rounded-md py-3 focus:border-[#e91e63] focus:shadow-md"
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: 900 }}
        pagination={{
          current: currentPage,
          pageSize: limit,
          total: pagination?.total,
          position: ["bottomCenter"],
          onChange: (page) => setCurrentPage(page),
          showSizeChanger: false,
          itemRender: (page, type, originalElement) => {
            if (type === "prev") {
              return (
                <Button className="bg-pink-500 text-white border-none">
                  Previous
                </Button>
              );
            }
            if (type === "next") {
              return (
                <Button className="bg-pink-500 text-white border-none">
                  Next
                </Button>
              );
            }
            if (type === "page") {
              return (
                <Button
                  className={
                    currentPage === page
                      ? "bg-pink-500 text-white border-none"
                      : "bg-white text-pink-500 border-pink-500"
                  }
                >
                  {page}
                </Button>
              );
            }
            return originalElement;
          },
        }}
        rowClassName="border-b border-pink-100 hover:bg-pink-50 transition-all"
      />

      <UserDetailsModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        user={detailsData}
      />
      <UpdateWorkerModal
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        workerData={updateData}
      />
    </div>
  );
};

export default WorkerTable;
