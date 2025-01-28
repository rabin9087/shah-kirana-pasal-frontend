import { useAppDispatch, useAppSelector } from "@/hooks";
import { RxCross1 } from "react-icons/rx";
import { Button } from "../ui/button";
import { toggleSideBar } from "@/redux/sidebar.slice";

const SideBar = ({ onSelect }: { onSelect: (menu: string) => void }) => {
    const { open } = useAppSelector((store) => store.sidebar);
    const dispatch = useAppDispatch();

    const menuItems = [
        { id: "users", label: "Users" },
        { id: "products", label: "Products" },
        { id: "categories", label: "Categories" },
    ];

    return (
        open && (
            <div className="flex w-full md:w-2/4 lg:w-1/4 flex-col p-1 bg-accent max-h-screen overflow-y-scroll">
                <div className="flex justify-end me-2 p-1">
                    <Button
                        className="mt-1 mb-3 text-end"
                        type="button"
                        onClick={() => {
                            dispatch(toggleSideBar());
                        }}
                    >
                        <RxCross1 className="text-red-500 bg-white" size={25} />
                    </Button>
                </div>

                <ul className="flex flex-col gap-4 overflow-y-scroll min-h-screen">
                    {menuItems.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => onSelect(item.id)} // Trigger parent callback
                            className="flex p-2 items-center justify-between font-bold text-secondary-foreground rounded-md overflow-hidden bg-white hover:bg-gray-400 cursor-pointer"
                        >
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    );
};

export default SideBar;
