import { useState, useEffect } from "react";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import {
  useActiveStateMutation,
  useGetAllStateQuery,
} from "../../redux/features/states/states";

const States = () => {
  const { data, isLoading, isError } = useGetAllStateQuery();
  const states = data?.data;
  const [activeState] = useActiveStateMutation();
  const [activeStates, setActiveStates] = useState([]);

  const toggleState = async (state) => {
    try {
      const updatedState = { active: !state.active };
      await activeState({ id: state._id, data: updatedState });
      setActiveStates((prev) =>
        prev.includes(state._id)
          ? prev.filter((s) => s !== state._id)
          : [...prev, state._id]
      );
    } catch (err) {
      console.error("Error updating state", err);
    }
  };

  useEffect(() => {
    if (states) {
      setActiveStates(
        states.filter((state) => state.active).map((state) => state._id)
      );
    }
  }, [states]);

  const sortedStates = [...states]?.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">States</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index}>
              <Skeleton.Button active size="large" block />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error fetching states!</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">States</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sortedStates?.map((state) => {
          const isActive = activeStates.includes(state._id);
          return (
            <button
              key={state._id}
              onClick={() => toggleState(state)}
              className={`flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all ${
                isActive
                  ? "bg-green-500 text-white"
                  : "bg-[#ffdfd3] text-gray-700"
              }`}
            >
              {isActive ? (
                <UnlockOutlined className="text-white" />
              ) : (
                <LockOutlined className="text-[#e91e63]" />
              )}
              {state.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default States;
