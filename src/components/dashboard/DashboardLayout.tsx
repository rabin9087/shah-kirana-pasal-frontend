import { useState } from "react";
import SideBar from "./SideBar";
import UsersDashboard from "./UserDashboard";
import ProductsDashboard from "./ProductDashBoard";
import CategoriesDashboard from "./CategoryDashboard";

const DashboardLayout = () => {
    const [activeMenu, setActiveMenu] = useState<string>("users"); // Default to 'users'

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
            {/* Sidebar */}
            <div className="w-64 text-white bg-gray-200">
                <SideBar onSelect={(menu) => setActiveMenu(menu)} />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 bg-gray-100">{renderContent()}</div>
        </div>
    );
};

export default DashboardLayout;
