import React from "react";
import CreateManager from "../../../page/CreateManager/CreateManager";

const CreateManagerModal = ({ isOpen, onClose, onSubmit, createLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-[#e91e63] text-xl"
        >
          ✕
        </button>
        <CreateManager onSubmit={onSubmit} createLoading={createLoading} />
      </div>
    </div>
  );
};

export default CreateManagerModal;
