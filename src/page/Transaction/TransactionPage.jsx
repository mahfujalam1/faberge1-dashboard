import { ScaleLoader } from "react-spinners";
import {
  useDeleteTransactionMutation,
  useGetAllTransactionsQuery,
} from "../../redux/features/booking/booking";
import { Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const TransactionsPage = () => {
  const { data, isLoading } = useGetAllTransactionsQuery();
  const mockTransactions = data?.transactions;
  console.log(mockTransactions);

  const [deleteTransaction] = useDeleteTransactionMutation(); // Mutation for deleting transaction

  const handleDeleteTransaction = async (transactionId) => {
    const res = await deleteTransaction(transactionId);
    if (res?.data?.success) {
      toast.success(res?.data?.message);
    } else if (res?.error) {
      toast.error(res?.error?.message);
    }
  };

  const formatDateTime = (dateString) => {
    // Split date from ISO string (YYYY-MM-DD)
    const formattedDate = dateString?.split("T")[0];

    return `${formattedDate}`;
  };

  const formattedTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  };

  return (
    <div className="p-6 overflow-x-auto md:w-[420px] lg:w-[680px] xl:w-full">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Transactions</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-pink-100">
        <table className="w-full text-sm text-left text-gray-700 min-w-[900px]">
          <thead className="bg-pink-50 uppercase text-xs text-gray-600">
            <tr>
              <th className="px-6 py-3">User Name</th>
              <th className="px-6 py-3">Service</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Payment Method</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Transaction ID</th>
              <th className="px-6 py-3">Actions</th>{" "}
              {/* Added actions column */}
            </tr>
          </thead>

          <tbody>
            {mockTransactions?.length > 0 ? (
              mockTransactions?.map((item) => (
                <tr
                  key={item?._id}
                  className="border-b border-pink-100 hover:bg-pink-50 transition-all"
                >
                  {/* User Name */}
                  <td className="px-6 py-3 flex items-center gap-3">
                    <img
                      src={`${import.meta.env.VITE_REACT_APP_BASE_URL}${
                        item?.worker?.uploadPhoto
                      }`}
                      alt={item?.worker?.firstName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span className="text-[#e91e63] font-medium cursor-pointer hover:underline">
                      {item?.worker?.firstName + " " + item?.worker?.lastName}
                    </span>
                  </td>

                  {/* Service */}
                  <td className="px-6 py-3 text-gray-700">
                    {item?.services?.map((service) => (
                      <ul key={service?.service?._id}>
                        <li>{service?.service?.serviceName}</li>
                      </ul>
                    ))}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-3 text-gray-600">
                    {formatDateTime(item?.createdAt)}
                  </td>


                  {/* Time */}
                  <td className="px-6 py-3 text-gray-600">
                    {formattedTime(item?.createdAt)}
                  </td>

                  {/* Payment Method */}
                  <td className="px-6 py-3 text-gray-700">
                    <span className="font-medium">Stripe</span>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-3 font-semibold text-gray-800">
                    ${item?.paymentAmount}
                  </td>

                  {/* Transaction ID */}
                  <td className="px-6 py-3 text-gray-600 font-mono">
                    {item?.transactionId}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3 text-right flex justify-center gap-4 text-[#e91e63]">
                    <Popconfirm
                      title="Are you sure you want to delete this transaction?"
                      onConfirm={() => handleDeleteTransaction(item._id)} // Call delete function on confirmation
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined className="cursor-pointer hover:text-pink-500 text-lg" />
                    </Popconfirm>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center text-center">
                      <ScaleLoader color="#ff0db4" />
                    </div>
                  ) : (
                    "No Transaction found"
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
