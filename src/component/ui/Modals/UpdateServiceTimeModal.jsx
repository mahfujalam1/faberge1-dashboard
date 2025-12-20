import React, { useState, useEffect } from "react";
import { Modal, TimePicker } from "antd";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "sonner";

const UpdateServiceTimeModal = ({
  isOpen,
  onClose,
  currentTime,
  onUpdate,
  isLoading,
}) => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    if (currentTime) {
      setStartTime(
        currentTime.startTime ? dayjs(currentTime.startTime, "HH:mm") : null
      );
      setEndTime(
        currentTime.endTime ? dayjs(currentTime.endTime, "HH:mm") : null
      );
    }
  }, [currentTime]);

  const handleSubmit = () => {
    if (!startTime || !endTime) {
      toast.error("Please select both start and end time");
      return;
    }

    const timeData = {
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
    };

    onUpdate(timeData);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <EditOutlined className="text-[#e91e63]" />
          <span>Update Service Time</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
    >
      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Time
          </label>
          <TimePicker
            value={startTime}
            onChange={setStartTime}
            format="HH:mm"
            className="w-full"
            size="large"
            placeholder="Select start time"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time
          </label>
          <TimePicker
            value={endTime}
            onChange={setEndTime}
            format="HH:mm"
            className="w-full"
            size="large"
            placeholder="Select end time"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-2.5 rounded-lg font-semibold transition-all ${
            isLoading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#e91e63] hover:bg-pink-600 text-white"
          }`}
        >
          {isLoading ? "Updating..." : "Update Service Time"}
        </button>
      </div>
    </Modal>
  );
};

export default UpdateServiceTimeModal;
