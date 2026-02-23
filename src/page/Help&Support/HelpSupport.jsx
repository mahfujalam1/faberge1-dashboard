import React from "react";
import {
  MailOutlined,
  UserOutlined,
  MessageOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Popconfirm, Table } from "antd";
import {
  useDeleteContactUsMutation,
  useGetAllMessagesQuery,
} from "../../redux/features/help-and-support/message";
import { ScaleLoader } from "react-spinners";

const HelpSupport = () => {
  const { data, isLoading } = useGetAllMessagesQuery();
  const contactMessages = data?.data;

  const [deleteContactUs, { isLoading: deleteLoading }] =
    useDeleteContactUsMutation();

  const handleDelete = async (id) => {
    try {
      await deleteContactUs(id);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const formatDate = (dateString) => {
    return dateString?.split("T")[0];
  };

  const formattedTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_, msg) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-[#e91e63]" />
          <span>{msg.firstName}</span>
        </div>
      ),
    },
    {
      title: "Email",
      key: "email",
      render: (_, msg) => (
        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${msg.email}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#e91e63] hover:underline"
        >
          <MailOutlined /> {msg.email}
        </a>
      ),
    },
    {
      title: "Subject",
      key: "subject",
      render: (_, msg) => <span>{msg.subject || "this is subject"}</span>,
    },
    {
      title: "Message",
      key: "message",
      render: (_, msg) => (
        <div className="flex items-start gap-2">
          <MessageOutlined className="text-gray-400 mt-[2px]" />
          <p className="text-gray-600 truncate max-w-[280px]">{msg.message}</p>
        </div>
      ),
    },
    {
      title: "Date",
      key: "date",
      render: (_, msg) => (
        <span className="text-gray-500">{formatDate(msg.createdAt)}</span>
      ),
    },
    {
      title: "Time",
      key: "time",
      render: (_, msg) => (
        <span className="text-gray-500">{formattedTime(msg.createdAt)}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, msg) => (
        <Popconfirm
          title="Delete Message"
          description="Are you sure you want to delete this message?"
          onConfirm={() => handleDelete(msg._id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{
            style: { backgroundColor: "#e91e63" },
            loading: deleteLoading,
          }}
        >
          <button
            className="text-red-500 hover:text-red-700 transition-colors"
            disabled={deleteLoading}
          >
            <DeleteOutlined className="text-lg" />
          </button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-6 overflow-x-auto md:w-[420px] lg:w-[680px] xl:w-full">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Help & Support Messages
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-pink-100 mt-4">
        <Table
          columns={columns}
          dataSource={contactMessages}
          rowKey="_id"
          loading={isLoading}
          scroll={{ x: 900 }}
          pagination={false}
          rowClassName={(record) =>
            record?.isRead === true
              ? "border-b border-pink-100 hover:bg-pink-50 transition-all"
              : "bg-pink-100 font-bold shadow-lg"
          }
        />
      </div>
    </div>
  );
};

export default HelpSupport;
