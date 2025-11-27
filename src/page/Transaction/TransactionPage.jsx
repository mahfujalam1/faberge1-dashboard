import { useGetAllTransactionsQuery } from "../../redux/features/booking/booking";

const TransactionsPage = () => {
  const { data } = useGetAllTransactionsQuery();
  const mockTransactions = data?.transactions;
  console.log(mockTransactions);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate}, ${formattedTime}`;
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
              <th className="px-6 py-3">Payment Method</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Transaction ID</th>
            </tr>
          </thead>

          <tbody>
            {mockTransactions?.map((item) => (
              <tr
                key={item?._id}
                className="border-b border-pink-100 hover:bg-pink-50 transition-all"
              >
                {/* User Name */}
                <td className="px-6 py-3 flex items-center gap-3">
                  <img
                    src={
                      item?.worker?.uploadPhoto &&
                      item?.worker?.uploadPhoto ===
                        "http://10.10.20.16:5137undefined"
                        ? "https://avatar.iran.liara.run/public/39"
                        : item?.worker?.uploadPhoto
                    }
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
                  {formatDateTime(item?.date)}
                </td>

                {/* Payment Method */}
                <td className="px-6 py-3 text-gray-700">
                  <span className="font-medium">Stripe</span>
                </td>

                {/* Amount */}
                <td className="px-6 py-3 font-semibold text-gray-800">
                  {item?.paymentAmount}
                </td>

                {/* Transaction ID */}
                <td className="px-6 py-3 text-gray-600 font-mono">
                  {item?.transactionId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
