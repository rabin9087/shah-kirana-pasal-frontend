import { useAppSelector } from "@/hooks";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
const SideBar = () => {
  const { open } = useAppSelector((store) => store.sidebar);

  const buttonItems = [
    {btn: "Fruits & Veg", path: "/"},
    {btn: "Bakery", path: "/"},
    {btn: "Deli & Chilled Meals", path: "/"},
    {btn: "dairy, Eggs & Fridge", path: "/"},
    {btn: "Lunch", path: "/"},
    {btn: "Pantry", path: "/"},
    {btn: "International Foods", path: "/"},
    {btn: "Drinks", path: "/"},
    {btn: "Chocolates", path: "/"},
    {btn: "Kitchen", path: "/"},
  ]
  return (
    <motion.div
      initial={{ width: "0px" }}
      animate={{ width: open ? "300px" : "0px" }}
      className={`sm:block  bg-accent p-3  overflow-y-auto animate-side-bar-open hidden ${
        open ? " w-screen block sm:w-[100px] md:w-[240px]" : "hidden"
      }`}
    >
      <div className="flex flex-col p-1">
        <ul className="flex flex-col gap-4 ">
          {buttonItems
            .map(({btn, path},index) => (
              <Link key={index} to={path}>
              <li
                className="flex p-2 items-center justify-between min-w-fit font-bold text-secondary-foreground rounded-md overflow-hidden bg-white hover:bg-gray-400"
              >
                <button>{btn}</button>
                <IoIosArrowForward />
              </li>
              </Link>
            ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default SideBar;
