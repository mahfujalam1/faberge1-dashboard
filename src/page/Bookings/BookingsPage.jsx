import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table } from "antd";
import { useState } from "react";
import BookingDetailsModal from "../../component/ui/Modals/BookingDetailsModal";
import {
  useDeleteBookingMutation,
  useGetAllBookingsQuery,
} from "../../redux/features/booking/booking";
import { toast } from "sonner";

const BookingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const limit = 10;
  const { data, isLoading } = useGetAllBookingsQuery({
    page: currentPage,
    limit,
    status: "",
  });
  const bookings = data?.data;
  const pagination = data?.pagination;

  const [deleteBooking] = useDeleteBookingMutation();

  const formatDateTime = (dateString, startTime) => {
    const formattedDate = dateString?.split("T")[0];
    let formattedTime = "N/A";
    if (startTime) {
      const [hours, minutes] = startTime.split(":");
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      formattedTime = `${hour12}:${minutes} ${period}`;
    }
    return `${formattedDate}, ${formattedTime}`;
  };

  const formatServices = (services) => {
    if (!services || services.length === 0) return "N/A";
    return services
      .map((serviceItem) => {
        const mainService =
          serviceItem.service?.serviceName || "Unknown Service";
        const subServices = serviceItem.subcategories
          ?.map((sub) => sub.subcategoryName)
          .join(", ");
        return subServices ? `${mainService} (${subServices})` : mainService;
      })
      .join(" | ");
  };

  const handleDeleteBooking = async (bookingId) => {
    const res = await deleteBooking(bookingId);
    if (res?.data?.success) {
      toast.success("Booking deleted successfully");
    } else if (res?.error) {
      toast.error("Failed to delete booking");
    }
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (_, booking) => (
        <div className="flex items-center gap-3">
          <img
            src={`${import.meta.env.VITE_REACT_APP_BASE_URL}${booking?.customer?.uploadPhoto}`}
            alt={booking?.customer?.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="text-sm font-semibold text-[#e91e63] cursor-pointer hover:underline">
            {booking?.customer?.firstName + " " + booking?.customer?.lastName}
          </p>
        </div>
      ),
    },
    {
      title: "Worker",
      dataIndex: "worker",
      key: "worker",
      render: (_, booking) => (
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-gray-700">
            {booking?.worker?.firstName + " " + booking?.worker?.lastName}
          </p>
          <p className="text-xs text-gray-500">{booking?.worker?.workerId}</p>
        </div>
      ),
    },
    {
      title: "Service",
      dataIndex: "services",
      key: "services",
      render: (services) => (
        <div className="text-sm text-gray-600">{formatServices(services)}</div>
      ),
    },
    {
      title: "Date & Time",
      key: "dateTime",
      render: (_, booking) => (
        <span className="text-gray-600">
          {formatDateTime(booking?.date, booking?.startTime)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            status === "completed"
              ? "bg-green-100 text-green-700"
              : status === "booked"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, booking) => (
        <div className="flex justify-center gap-4 text-[#e91e63]">
          <EyeOutlined
            className="cursor-pointer hover:text-pink-500 text-lg"
            onClick={() => setSelectedBooking(booking)}
          />
          <Popconfirm
            title="Are you sure you want to delete this booking?"
            onConfirm={() => handleDeleteBooking(booking._id)}
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
    <div className="p-6 overflow-x-auto md:w-[420px] lg:w-[680px] xl:w-full">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">All Bookings</h1>

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

      <BookingDetailsModal
        isOpen={!!selectedBooking}
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
};

export default BookingsPage;
