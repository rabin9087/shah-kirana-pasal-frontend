import { useState } from "react";
import Location from "./Location";
import TransferStock from "./TransferStock";

const tabs = ["Location", "Transfer Stock", "Stock Count Session"];

// Example Components (Replace with your actual components)
const LocationComponent = () => <Location/>;
const TransferComponent = () => <TransferStock/>;
const StockCountComponent = () => <div className="p-4">📦 Stock Count Session Component Loaded</div>;

const StockDashboard = () => {
    const [activeTab, setActiveTab] = useState<string>("Location");

    // Render component based on active tab
    const renderComponent = () => {
        switch (activeTab) {
            case "Location":
                return <LocationComponent />;
            case "Transfer Stock":
                return <TransferComponent />;
            case "Stock Count Session":
                return <StockCountComponent />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full p-4">
            {/* Tab Row */}
            <div className="flex gap-4 justify-center border-b pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all 
              ${activeTab === tab
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Render selected component */}
            <div className="mt-6">{renderComponent()}</div>
        </div>
    );
};

export default StockDashboard;
