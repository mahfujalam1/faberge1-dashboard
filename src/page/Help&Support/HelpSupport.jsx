import React from "react";
import { MailOutlined, UserOutlined, MessageOutlined } from "@ant-design/icons";
import { useGetAllMessagesQuery } from "../../redux/features/help-and-support/message";
import { ScaleLoader } from "react-spinners";

const HelpSupport = () => {
  const { data, isLoading } = useGetAllMessagesQuery();
  const contactMessages = data?.data;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return `${formattedDate}`;
  };

  return (
    <div className="p-6 overflow-x-auto md:w-[420px] lg:w-[680px] xl:w-full">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Help & Support Messages
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm text-left text-gray-700">
          <thead className="bg-pink-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 w-[150px]">Name</th>
              <th className="px-6 py-3 w-[200px]">Email</th>
              <th className="px-6 py-3 w-[180px]">Subject</th>
              <th className="px-6 py-3 w-[300px]">Message</th>
              <th className="px-6 py-3 w-[120px]">Date</th>
            </tr>
          </thead>
          <tbody>
            {contactMessages?.length > 0 ? (
              contactMessages?.map((msg) => (
                <tr
                  key={msg._id}
                  className={`${
                    msg?.isRead === true
                      ? "border-b border-pink-100 hover:bg-pink-50 transition-all"
                      : "bg-pink-100 font-bold shadow-lg"
                  }`}
                >
                  <td className="px-6 py-3 flex items-center gap-2">
                    <UserOutlined className="text-[#e91e63]" />
                    <span>{msg.firstName}</span>
                  </td>

                  <td className="px-6 py-3">
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${msg.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#e91e63] hover:underline"
                    >
                      <MailOutlined /> {msg.email}
                    </a>
                  </td>

                  <td className="px-6 py-3">
                    {msg.subject || "this is subject"}
                  </td>

                  <td className="px-6 py-3 flex items-start gap-2">
                    <MessageOutlined className="text-gray-400 mt-[2px]" />
                    <p className="text-gray-600 truncate max-w-[280px]">
                      {msg.message}
                    </p>
                  </td>

                  <td className="px-6 py-3 text-gray-500">
                    {formatDateTime(msg.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center text-center">
                      <ScaleLoader color="#ff0db4" />
                    </div>
                  ) : (
                    "No Help & Support found"
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

export default HelpSupport;
