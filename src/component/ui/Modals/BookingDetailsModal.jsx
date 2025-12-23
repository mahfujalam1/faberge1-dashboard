import { CloseOutlined } from "@ant-design/icons";
import React from "react";

const BookingDetailsModal = ({ isOpen, booking, onClose }) => {
  if (!isOpen || !booking) return null;

  // Calculate total price
  const calculateTotal = () => {
    if (!booking.services || booking.services.length === 0) return 0;

    let total = 0;
    booking.services.forEach((serviceItem) => {
      // Add main service price
      total += serviceItem.service?.price || 0;

      // Add subcategories prices
      if (serviceItem.subcategories && serviceItem.subcategories.length > 0) {
        serviceItem.subcategories.forEach((sub) => {
          total += sub.subcategoryPrice || 0;
        });
      }
    });

    return total;
  };

  const totalPrice = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative">
        {/* 🔹 Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-[#e91e63]"
        >
          <CloseOutlined className="text-lg" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Service Details
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          See all details about Service
        </p>

        {/* Service Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          {booking.services?.[0]?.service?.serviceName || "Service"}
        </h3>

        {/* Details List */}
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-semibold">Customer</span>
            <span>
              {booking?.customer?.firstName + " " + booking?.customer?.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Worker</span>
            <span>
              {booking?.worker?.firstName + " " + booking?.worker?.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Location</span>
            <span>{booking?.city || "New York"}</span>
          </div>

          {/* Dynamic Services */}
          {booking.services?.map((serviceItem, index) => (
            <React.Fragment key={index}>
              {/* Main Service */}
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold">
                  {serviceItem.service?.serviceName || "Service"}
                </span>
                <span>${serviceItem.service?.price || 0}</span>
              </div>

              {/* Subcategories */}
              {serviceItem.subcategories?.map((sub, subIndex) => (
                <div key={subIndex} className="flex justify-between pl-4">
                  <span className="text-gray-600">+ {sub.subcategoryName}</span>
                  <span>${sub.subcategoryPrice || 0}</span>
                </div>
              ))}
            </React.Fragment>
          ))}

          {/* Total */}
          <div className="flex justify-between mt-4 pt-3 border-t-2 border-pink-200">
            <span className="font-bold text-base">Total</span>
            <span className="font-bold text-base text-[#e91e63]">
              ${totalPrice}
            </span>
          </div>

          {/* Status */}
          <div className="flex justify-between mt-2">
            <span className="font-semibold">Status</span>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                booking.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : booking.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {booking.status === "expired" ? "pending" : booking?.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
