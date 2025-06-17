import { useEffect, useState } from "react";
import UsersDashboard from "./userDashboard/UserDashboard";
import ProductsDashboard from "./productsDashboard/ProductsDashboard";
import CategoriesDashboard from "./categoryDashboard/CategoriesDashboard";
import OrdersDashboard from "./ordersDashboard/OrdersDashboard";
import Sales from "./sales/Sales";
import StoreSalesDashboard from "./storeSales/StoreSalesDashboard";
import { StroreRouter } from "@/pages/users/PrivateRouter";
import { useAppSelector } from "@/hooks";
import { useNavigate, useParams } from "react-router";

const DashboardLayout = () => {
    const { user } = useAppSelector((state) => state.userInfo);
    const { menu } = useParams();
    const navigate = useNavigate();

    const menuItems = ["users", "products", "categories", "orders", "online_sales", "store_sales"];
    const pickerMenu = ["orders"];

    // Split menus
    const primaryMenus = ["users", "products", "categories", "orders", "online_sales", "store_sales"];
    // const secondaryMenus = [];

    const getMenuItems = () => {
        if (user.role === "ADMIN" || user?.role === "SUPERADMIN") return [...menuItems];
        if (user.role === "PICKER") return [...pickerMenu];
        return [];
    };

    const allowedMenus = getMenuItems();
    const allowedPrimaryMenus = primaryMenus.filter(item => allowedMenus.includes(item));
    // const allowedSecondaryMenus = secondaryMenus.filter(item => allowedMenus.includes(item));

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
            case "store_sales":
                return (
                    <StroreRouter>
                        <StoreSalesDashboard />
                    </StroreRouter>
                );
            default:
                return <div>Select a menu item to view details</div>;
        }
    };

    return (
        <div className="overflow-x-auto">
            <div className="flex justify-center gap-4 my-4 mx-8">
                {/* Primary Select */}
                {allowedPrimaryMenus.length > 0 && (
                    <select
                        value={activeMenu}
                        onChange={(e) => handleMenuClick(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option disabled>Select Main Menu</option>
                        {allowedPrimaryMenus.map((item) => (
                            <option key={item} value={item}>
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </option>
                        ))}
                    </select>
                )}

                {/* Secondary Select */}
                {/* {allowedSecondaryMenus.length > 0 && (
                    <select
                        value={activeMenu}
                        onChange={(e) => handleMenuClick(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option disabled>Select Secondary Menu</option>
                        {allowedSecondaryMenus.map((item) => (
                            <option key={item} value={item}>
                                {item.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </option>
                        ))}
                    </select>
                )} */}
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
