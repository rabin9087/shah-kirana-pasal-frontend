import { useState } from 'react';
import UsersDashboard from './userDashboard/UserDashboard';
import { Button } from '../ui/button';
import ProductsDashboard from './productsDashboard/ProductsDashboard';
import CategoriesDashboard from './categoryDashboard/CategoriesDashboard';
import OrdersDashboard from './ordersDashboard/OrdersDashboard';

const DashboardLayout = () => {
    const menuItems = ['users', 'products', 'categories', "orders"];
    const [activeMenu, setActiveMenu] = useState(menuItems[0]);

    const renderContent = () => {
        switch (activeMenu) {
            case menuItems[0]:
                return <UsersDashboard />;
            case menuItems[1]:
                return <ProductsDashboard />;
            case menuItems[2]:
                return <CategoriesDashboard />;
            case menuItems[3]:
                return <OrdersDashboard />;
            default:
                return <div>Select a menu item to view details</div>;
        }
    };

    return (
        <div>
            <div className="flex justify-center gap-2">
                {menuItems.map((item) => (
                    <Button
                        key={item}
                        onClick={() => setActiveMenu(item)}
                        className={`${activeMenu === item ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                            } px-4 py-2 rounded-md focus:outline-none`}
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
