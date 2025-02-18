import { useEffect, useState } from 'react';
import UsersDashboard from './userDashboard/UserDashboard';
import { Button } from '../ui/button';
import ProductsDashboard from './productsDashboard/ProductsDashboard';
import CategoriesDashboard from './categoryDashboard/CategoriesDashboard';
import OrdersDashboard from './ordersDashboard/OrdersDashboard';
import { useNavigate, useParams } from 'react-router';

const DashboardLayout = () => {
    const menuItems = ['users', 'products', 'categories', 'orders'];
    const { menu } = useParams();
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState(menuItems.includes(menu as string) ? menu : menuItems[0]);

    useEffect(() => {
        if (menuItems.includes(menu as string)) {
            setActiveMenu(menu);
        }
    }, [menu]);

    const handleMenuClick = (item: string) => {
        setActiveMenu(item);
        navigate(`/dashboard/${item}`);
    };

    const renderContent = () => {
        switch (activeMenu) {
            case 'users':
                return <UsersDashboard />;
            case 'products':
                return <ProductsDashboard />;
            case 'categories':
                return <CategoriesDashboard />;
            case 'orders':
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
                        onClick={() => handleMenuClick(item)}
                        className={`px-4 py-2 rounded-md focus:outline-none ${activeMenu === item ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
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