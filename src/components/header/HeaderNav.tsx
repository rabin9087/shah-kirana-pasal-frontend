import { useState } from "react";
import { ChevronDown } from "lucide-react";

const navItems = [
    { title: "Specials & Catalogue", link: "#" },
    { title: "Recipes & Ideas", link: "#" },
    { title: "Get More Value", link: "#" },
    { title: "Ways to Shop", link: "#" },
    { title: "Help", link: "#" },
];

const HeaderNav = () => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleDropdown = (title: string) => {
        setActiveDropdown(activeDropdown === title ? null : title);
    };

    return (
        <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-6">

                <ul className="hidden md:flex gap-6">
                    {navItems.map((item) => (
                        <li key={item.title} className="relative">
                            <button
                                onClick={() => toggleDropdown(item.title)}
                                className="flex items-center gap-1 text-gray-700 hover:text-primary"
                            >
                                {item.title} <ChevronDown size={16} />
                            </button>

                            {activeDropdown === item.title && (
                                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg border rounded-md p-3">
                                    <a href="#" className="block px-3 py-2 hover:bg-gray-100">
                                        Option 1
                                    </a>
                                    <a href="#" className="block px-3 py-2 hover:bg-gray-100">
                                        Option 2
                                    </a>
                                    <a href="#" className="block px-3 py-2 hover:bg-gray-100">
                                        Option 3
                                    </a>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default HeaderNav;
