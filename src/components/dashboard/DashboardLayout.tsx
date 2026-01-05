import { useEffect, useState } from "react";
import UsersDashboard from "./userDashboard/UserDashboard";
import ProductsDashboard from "./productsDashboard/ProductsDashboard";
import CategoriesDashboard from "./categoryDashboard/CategoriesDashboard";
import OrdersDashboard from "./ordersDashboard/OrdersDashboard";
import Sales from "./sales/Sales";
import StoreSalesDashboard from "./storeSales/StoreSalesDashboard";
import { StoreRouter } from "@/pages/users/PrivateRouter";
import { useAppSelector } from "@/hooks";
import { useNavigate, useParams } from "react-router";
import StockDashboard from "./stocksDashboard/StockDashboard";

const DashboardLayout = () => {
    const { user } = useAppSelector((state) => state.userInfo);
    const { menu } = useParams();
    const navigate = useNavigate();

    const menuItems = ["users", "products", "categories", "orders", "online_sales", "store_sales", "Stock"];
    const pickerMenu = ["orders"];
    const primaryMenus = ["users", "products", "categories", "orders", "online_sales", "store_sales", "Stock"];

    const getMenuItems = () => {
        if (user.role === "ADMIN" || user?.role === "SUPERADMIN") return [...menuItems];
        if (user.role === "PICKER") return [...pickerMenu];
        return [];
    };

    const allowedMenus = getMenuItems();
    const allowedPrimaryMenus = primaryMenus.filter(item => allowedMenus.includes(item));

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
            case "online_sales":
                return <Sales />;
            case "Stock":
                return <StockDashboard />;
            case "store_sales":
                return (
                    <StoreRouter>
                        <StoreSalesDashboard />
                    </StoreRouter>
                );
            default:
                return <div>Select a menu item to view details</div>;
        }
    };

    return (
        <div className="overflow-x-auto">
            {/* Select tag on mobile only */}
            <div className="block md:hidden mx-4 mt-4">
                <select
                    value={activeMenu}
                    onChange={(e) => handleMenuClick(e.target.value)}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {allowedPrimaryMenus.map((item) => (
                        <option key={item} value={item}>
                            {item.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tab buttons on tablet and desktop only */}
            <div className="hidden md:flex flex-wrap justify-center gap-4 mx-8 mt-6">
                {allowedPrimaryMenus.map((item) => (
                    <button
                        key={item}
                        onClick={() => handleMenuClick(item)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${activeMenu === item
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        {item.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                ))}
            </div>

            <div className="flex min-h-screen my-4">
                <div className="flex-1 p-4 md:p-6 bg-gray-100 w-full">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
