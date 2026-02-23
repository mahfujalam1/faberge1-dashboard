import { useState } from "react";
import { Button, Popconfirm, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ScaleLoader } from "react-spinners";
import { toast } from "sonner";
import {
  useDeleteNotificationMutation,
  useGetAllNotificationsQuery,
} from "../../../redux/features/booking/booking";

const Notifications = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteNotification] = useDeleteNotificationMutation();

  const limit = 10;
  const { data, isLoading } = useGetAllNotificationsQuery({
    page: currentPage,
    limit,
    status: "",
  });
  const bookings = data?.notification;
  const pagination = data?.pagination;

  const formatDateTime = (dateString) => {
    const datePart = dateString.split("T")[0];
    const dateObj = new Date(dateString);
    const formattedTime = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${datePart}, ${formattedTime}`;
  };

  const formatServices = (services) => {
    if (!services || services.length === 0) return "N/A";
    return services
      .map((serviceItem) => {
        const mainService =
          serviceItem.service?.serviceName || "Unknown Service";
        const subServices = serviceItem.service?.subcategory
          ?.map((sub) => sub.subcategoryName)
          .join(", ");
        return subServices ? `${mainService} (${subServices})` : mainService;
      })
      .join(" | ");
  };

  const handleDeleteNotification = async (notificationId) => {
    const res = await deleteNotification(notificationId);
    if (res?.data) {
      toast.success(res?.data?.message || "Notification deleted successfully");
    } else if (res?.error) {
      toast.error(res?.error?.data?.message || "Failed to delete notification");
    }
  };

  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (_, booking) => (
        <span>
          {booking?.customer?.firstName + " " + booking?.customer?.lastName}
        </span>
      ),
    },
    {
      title: "Worker",
      key: "worker",
      render: (_, booking) => (
        <span>
          {booking?.worker?.firstName + " " + booking?.worker?.lastName}
        </span>
      ),
    },
    {
      title: "Services",
      key: "services",
      render: (_, booking) => (
        <span className="text-gray-600">
          {formatServices(booking?.services)}
        </span>
      ),
    },
    {
      title: "Payment Amount",
      key: "paymentAmount",
      render: (_, booking) => <span>${booking?.paymentAmount}</span>,
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "Date",
      key: "date",
      render: (_, booking) => (
        <span className="text-gray-600">
          {formatDateTime(booking?.createdAt)}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, booking) => (
        <div className="flex justify-center text-[#e91e63]">
          <Popconfirm
            title="Delete Notification"
            description="Are you sure you want to delete this notification?"
            onConfirm={() => handleDeleteNotification(booking._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ className: "bg-pink-500 hover:bg-pink-600" }}
          >
            <DeleteOutlined className="cursor-pointer hover:text-pink-500 text-lg text-[#e91e63]" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-6 overflow-x-auto md:w-[420px] lg:w-[680px] xl:w-full">
      <h1 className="text-xl font-semibold text-gray-800 mb-5">
        Notifications
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-pink-100 mt-4">
        <Table
          columns={columns}
          dataSource={bookings}
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
      </div>
    </div>
  );
};

export default Notifications;
