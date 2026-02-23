import { ScaleLoader } from "react-spinners";
import {
  useDeleteTransactionMutation,
  useGetAllTransactionsQuery,
} from "../../redux/features/booking/booking";
import { Popconfirm, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { toast } from "sonner";

const TransactionsPage = () => {
  const { data, isLoading } = useGetAllTransactionsQuery();
  const mockTransactions = data?.transactions;

  const [deleteTransaction] = useDeleteTransactionMutation();

  const handleDeleteTransaction = async (transactionId) => {
    const res = await deleteTransaction(transactionId);
    if (res?.data?.success) {
      toast.success(res?.data?.message);
    } else if (res?.error) {
      toast.error(res?.error?.message);
    }
  };

  const formatDateTime = (dateString) => {
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
      title: "User Name",
      key: "userName",
      render: (_, item) => (
        <div className="flex items-center gap-3">
          <img
            src={`${import.meta.env.VITE_REACT_APP_BASE_URL}${item?.worker?.uploadPhoto}`}
            alt={item?.worker?.firstName}
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-[#e91e63] font-medium cursor-pointer hover:underline">
            {item?.worker?.firstName + " " + item?.worker?.lastName}
          </span>
        </div>
      ),
    },
    {
      title: "Service",
      key: "service",
      render: (_, item) => (
        <ul className="list-none m-0 p-0">
          {item?.services?.map((service) => (
            <li key={service?.service?._id}>{service?.service?.serviceName}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Date",
      key: "date",
      render: (_, item) => (
        <span className="text-gray-600">{formatDateTime(item?.createdAt)}</span>
      ),
    },
    {
      title: "Time",
      key: "time",
      render: (_, item) => (
        <span className="text-gray-600">{formattedTime(item?.createdAt)}</span>
      ),
    },
    {
      title: "Payment Method",
      key: "paymentMethod",
      render: () => <span className="font-medium">Stripe</span>,
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, item) => (
        <span className="font-semibold text-gray-800">
          ${item?.paymentAmount}
        </span>
      ),
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (id) => <span className="text-gray-600 font-mono">{id}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, item) => (
        <div className="flex justify-center text-[#e91e63]">
          <Popconfirm
            title="Are you sure you want to delete this transaction?"
            onConfirm={() => handleDeleteTransaction(item._id)}
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
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Transactions</h1>

      <div className="bg-white rounded-xl shadow-sm border border-pink-100 mt-4">
        <Table
          columns={columns}
          dataSource={mockTransactions}
          rowKey="_id"
          loading={isLoading}
          scroll={{ x: 900 }}
          pagination={false}
          rowClassName="border-b border-pink-100 hover:bg-pink-50 transition-all"
        />
      </div>
    </div>
  );
};

export default TransactionsPage;
