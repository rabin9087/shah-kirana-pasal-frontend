import { useAppDispatch, useAppSelector } from "@/hooks";
import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { IoIosArrowForward } from "react-icons/io";
import { toggleSideBar } from "@/redux/sidebar.slice";
import { useEffect, useRef } from "react";
const SideBar = () => {
  const drawerRef = useRef(null);
  const { open } = useAppSelector((store) => store.sidebar);
  const dispatch = useAppDispatch();

  const menuItems = [
    { item: "Fruits & Veg", path: "/fruits_vegs" },
    { item: "Bakery", path: "/bakery" },
    { item: "Deli & Chilled Meals", path: "/deli_chilled_meals" },
    { item: "dairy, Eggs & Fridge", path: "/dairy_eggs_fridge" },
    { item: "Lunch", path: "/lunch" },
    { item: "Pantry", path: "/pantry" },
    { item: "International Foods", path: "/international_foods" },
    { item: "Drinks", path: "/drinks" },
    { item: "Chocolates", path: "/chocoloats" },
    { item: "Kitchen", path: "/kitchen" },
  ]


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef?.current?.contains(event.target)) {
        dispatch(toggleSideBar());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [drawerRef]);


  return (
    // <motion.div
    //   initial={{ width: "0px" }}
    //   animate={{ width: open ? "300px" : "200px" }}
    //   className={`bg-accent overflow-y-auto z-10 animate-side-bar-open  ${open ? "w-full block sm:w-full md:w-[240px]" : "hidden"
    //     }`}
    // >
    <div>

      {open && (<div className="flex w-full md:w-2/4 lg:w-1/4 flex-col p-1 bg-accent min-h-screen " ref={drawerRef}>
        <div className="flex justify-end me-2 p-1">
          <button className="mt-1 mb-3 text-end" type="button" onClick={() => {
            dispatch(toggleSideBar());
          }}>
            <RxCross1 className="text-red-500 bg-white" size={25} />
          </button>
        </div>


        <ul className="flex flex-col gap-4 overflow-y-auto">
          {menuItems
            .map(({ item, path }, index) => (
              <Link key={index} to={path}>
                <li
                  className="flex p-2 items-center justify-between dark:text-secondary min-w-fit font-bold text-secondary-foreground rounded-md overflow-hidden bg-white hover:bg-gray-400"
                >
                  <span>{item}</span>
                  <IoIosArrowForward />
                </li>
              </Link>
            ))}
        </ul>
      </div>)}
    </div >
  );
};

export default SideBar;
