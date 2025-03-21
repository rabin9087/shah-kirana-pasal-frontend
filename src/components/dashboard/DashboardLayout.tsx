import { useEffect, useState } from "react";
import UsersDashboard from "./userDashboard/UserDashboard";
import { Button } from "../ui/button";
import ProductsDashboard from "./productsDashboard/ProductsDashboard";
import CategoriesDashboard from "./categoryDashboard/CategoriesDashboard";
import OrdersDashboard from "./ordersDashboard/OrdersDashboard";
import { useNavigate, useParams } from "react-router";
import Sales from "./sales/Sales";
import { useAppSelector } from "@/hooks";

const DashboardLayout = () => {
    const menuItems = ["users", "products", "categories", "orders", "sales"];
    const pickerMenu = ["orders"]; // Menu for PICKER role
    const { user } = useAppSelector((state) => state.userInfo);
    const { menu } = useParams();
    const navigate = useNavigate();

    // Get allowed menu items based on role
    const getMenuItems = () => {
        if (user.role === "ADMIN" || user?.role === "SUPERADMIN") return menuItems;
        if (user.role === "PICKER") return pickerMenu;
        return [];
    };

    const allowedMenus = getMenuItems();

    // Set initial menu based on user's role
    const [activeMenu, setActiveMenu] = useState<string>(
        allowedMenus.includes(menu as string) ? (menu as string) : allowedMenus[0]
    );

    useEffect(() => {
        if (menu && allowedMenus.includes(menu)) {
            setActiveMenu(menu);
        }
    }, [menu, allowedMenus]);

    const handleMenuClick = (item: string) => {
        setActiveMenu(item);
        navigate(`/dashboard/${item}`);
    };

    const renderContent = () => {
        switch (activeMenu) {
            case "users":
                return <UsersDashboard />;
            case "products":
                return <ProductsDashboard />;
            case "categories":
                return <CategoriesDashboard />;
            case "orders":
                return <OrdersDashboard />;
            case "sales":
                return <Sales />;
            default:
                return <div>Select a menu item to view details</div>;
        }
    };

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-center gap-2">
                {allowedMenus.map((item) => (
                    <Button
                        key={item}
                        onClick={() => handleMenuClick(item)}
                        className={`px-4 py-2 rounded-md focus:outline-none ${activeMenu === item ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Button>
                ))}
            </div>
            <div className="flex min-h-screen my-4">
                <div className="flex-1 p-4 md:p-6 bg-gray-100 w-full">{renderContent()}</div>
            </div>
        </div>
    );
};

export default DashboardLayout;
