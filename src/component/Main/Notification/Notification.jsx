import { useState } from "react";
import { Button, Popconfirm, Table, Tabs, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import {
  useDeleteNotificationMutation,
  useGetAllNotificationsQuery,
} from "../../../redux/features/booking/booking";
import {
  useDeleteSubscriberMutation,
  useGetAllSubscribersQuery,
  useUpdateSubscriberStatusMutation,
} from "../../../redux/features/subscriber/subscriber";

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const datePart = dateString.split("T")[0];
  const dateObj = new Date(dateString);
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart}, ${formattedTime}`;
};

const tablePagination = (currentPage, limit, total, setCurrentPage) => ({
  current: currentPage,
  pageSize: limit,
  total,
  position: ["bottomCenter"],
  onChange: (page) => setCurrentPage(page),
  showSizeChanger: false,
  itemRender: (page, type, originalElement) => {
    if (type === "prev") {
      return (
        <Button className="bg-pink-500 text-white border-none">Previous</Button>
      );
    }
    if (type === "next") {
      return (
        <Button className="bg-pink-500 text-white border-none">Next</Button>
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
});

// --------------------
// Booking Notifications
// --------------------
const BookingNotifications = () => {
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
    <div className="bg-white rounded-xl shadow-sm border border-pink-100 mt-4">
      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: 900 }}
        pagination={tablePagination(
          currentPage,
          limit,
          pagination?.total,
          setCurrentPage
        )}
        rowClassName="border-b border-pink-100 hover:bg-pink-50 transition-all"
      />
    </div>
  );
};

// --------------------
// Subscriber Notifications
// --------------------
const SubscriberNotifications = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteSubscriber] = useDeleteSubscriberMutation();
  const [updateSubscriberStatus] = useUpdateSubscriberStatusMutation();

  const limit = 10;
  const { data, isLoading } = useGetAllSubscribersQuery({
    page: currentPage,
    limit,
  });
  const subscribers = data?.data;
  const pagination = data?.pagination;

  const handleDelete = async (id) => {
    const res = await deleteSubscriber(id);
    if (res?.data) {
      toast.success(res?.data?.message || "Subscriber deleted successfully");
    } else if (res?.error) {
      toast.error(res?.error?.data?.message || "Failed to delete subscriber");
    }
  };

  const handleToggleRead = async (id) => {
    const res = await updateSubscriberStatus(id);
    if (res?.error) {
      toast.error(res?.error?.data?.message || "Failed to update status");
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      key: "status",
      render: (_, subscriber) => (
        <Tag
          color={subscriber?.isRead ? "default" : "magenta"}
          className="cursor-pointer"
          onClick={() => handleToggleRead(subscriber._id)}
        >
          {subscriber?.isRead ? "Read" : "New"}
        </Tag>
      ),
    },
    {
      title: "Subscribed On",
      key: "date",
      render: (_, subscriber) => (
        <span className="text-gray-600">
          {formatDateTime(subscriber?.createdAt)}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, subscriber) => (
        <div className="flex justify-center text-[#e91e63]">
          <Popconfirm
            title="Delete Subscriber"
            description="Are you sure you want to delete this subscriber?"
            onConfirm={() => handleDelete(subscriber._id)}
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
    <div className="bg-white rounded-xl shadow-sm border border-pink-100 mt-4">
      <Table
        columns={columns}
        dataSource={subscribers}
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: 600 }}
        pagination={tablePagination(
          currentPage,
          limit,
          pagination?.total,
          setCurrentPage
        )}
        rowClassName="border-b border-pink-100 hover:bg-pink-50 transition-all"
      />
    </div>
  );
};

const Notifications = () => {
  const { data: subscriberData } = useGetAllSubscribersQuery({
    page: 1,
    limit: 10,
  });
  const unreadCount = subscriberData?.unreadCount || 0;

  const items = [
    {
      key: "bookings",
      label: "Booking Notifications",
      children: <BookingNotifications />,
    },
    {
      key: "subscribers",
      label: (
        <span>
          Subscribers
          {unreadCount > 0 && (
            <Tag color="magenta" className="ml-2">
              {unreadCount}
            </Tag>
          )}
        </span>
      ),
      children: <SubscriberNotifications />,
    },
  ];

  return (
    <div className="min-h-screen p-6 overflow-x-auto w-full">
      <h1 className="text-xl font-semibold text-gray-800 mb-5">
        Notifications
      </h1>

      <Tabs defaultActiveKey="bookings" items={items} />
    </div>
  );
};

export default Notifications;
