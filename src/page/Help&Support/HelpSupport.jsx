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
      width: 120,
      ellipsis: true,
      render: (_, msg) => (
        <div className="flex items-center gap-1.5">
          <UserOutlined className="text-[#e91e63] shrink-0" />
          <span>{msg.firstName}</span>
        </div>
      ),
    },
    {
      title: "Email",
      key: "email",
      width: 180,
      ellipsis: true,
      render: (_, msg) => (
        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${msg.email}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[#e91e63] hover:underline"
        >
          <MailOutlined className="shrink-0" />
          <span>{msg.email}</span>
        </a>
      ),
    },
    {
      title: "Subject",
      key: "subject",
      width: 130,
      ellipsis: true,
      render: (_, msg) => <span>{msg.subject || "this is subject"}</span>,
    },
    {
      title: "Message",
      key: "message",
      // ✅ No fixed width — this is the only flexible column.
      // Ant Design will give it all remaining space after fixed columns are placed.
      ellipsis: true,
      render: (_, msg) => (
        <div className="flex items-center gap-1.5">
          <MessageOutlined className="text-gray-400 shrink-0" />
          <span className="text-gray-600">{msg.message}</span>
        </div>
      ),
    },
    {
      title: "Date",
      key: "date",
      width: 100,
      render: (_, msg) => (
        <span className="text-gray-500 whitespace-nowrap">
          {formatDate(msg.createdAt)}
        </span>
      ),
    },
    {
      title: "Time",
      key: "time",
      width: 80,
      render: (_, msg) => (
        <span className="text-gray-500 whitespace-nowrap">
          {formattedTime(msg.createdAt)}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 70,
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

  // Fixed columns total: 120+180+130+100+80+70 = 680px
  // Message column gets whatever remains — works at any viewport width

  return (
    <div className="p-4 sm:p-6 w-full min-w-0 overflow-hidden">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Help & Support Messages
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-pink-100 mt-4 w-full">
        <Table
          columns={columns}
          dataSource={contactMessages}
          rowKey="_id"
          loading={isLoading}
          // ✅ Only triggers horizontal scroll on screens narrower than 680px
          scroll={{ x: 680 }}
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
