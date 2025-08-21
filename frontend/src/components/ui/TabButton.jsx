import React from "react";

function TabButton({ tabName, label, activeTab, setActiveTab }) {
  return (
    <button
      onClick={setActiveTab}
      className={`px-4 py-2 text-sm font-semibold cursor-pointer ${
        activeTab === tabName
          ? "border-b-2 border-teal-600 text-teal-600"
          : "text-gray-500"
      }`}
    >
      {label}
    </button>
  );
}

export default TabButton;
