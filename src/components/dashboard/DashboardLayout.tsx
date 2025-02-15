import { useState } from "react";
import SideBar from "./SideBar";
import UsersDashboard from "./userDashboard/UserDashboard";
import ProductsDashboard from "./ProductDashBoard";
import CategoriesDashboard from "./CategoryDashboard";

const DashboardLayout = () => {
    const [activeMenu, setActiveMenu] = useState<string>("users");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const renderContent = () => {
        switch (activeMenu) {
            case "users":
                return <UsersDashboard />;
            case "products":
                return <ProductsDashboard />;
            case "categories":
                return <CategoriesDashboard />;
            default:
                return <div>Select a menu item to view details</div>;
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Mobile Sidebar Toggle Button */}
            <button
                className="fixed top-4 left-4 z-50 bg-blue-600 text-white px-3 py-2 rounded md:hidden"
                onClick={() => setSidebarOpen(true)}
            >
                ☰ Menu
            </button>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:relative md:translate-x-0 md:w-64`}
            >
                <button
                    className="absolute top-4 right-4 text-white md:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    ✕
                </button>
                <SideBar onSelect={(menu) => {
                    setActiveMenu(menu);
                    setSidebarOpen(false); // Close sidebar after selection
                }} />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6 bg-gray-100 w-full">{renderContent()}</div>
        </div>
    );
};

export default DashboardLayout;
