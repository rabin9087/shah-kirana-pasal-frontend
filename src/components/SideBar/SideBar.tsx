import { useAppDispatch, useAppSelector } from "@/hooks";
import { RxCross1 } from "react-icons/rx";
import { IoIosArrowForward } from "react-icons/io";
import { toggleSideBar } from "@/redux/sidebar.slice";
import { useEffect, useRef } from "react";
import { getAllCategoriesAction } from "@/action/category.action";
import { Link } from "react-router-dom";
const SideBar = () => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { open } = useAppSelector((store) => store.sidebar);
  const dispatch = useAppDispatch();



  const { categories } = useAppSelector(state => state.categoryInfo)


  useEffect(() => {
    dispatch(getAllCategoriesAction())
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        dispatch(toggleSideBar());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [drawerRef, dispatch]);


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
          {categories
            .map(({ _id, name, slug }) => (
              <Link to={`/category/${slug}` as string} key={_id}>
                <li
                  className="flex p-2 items-center justify-between dark:text-secondary min-w-fit font-bold text-secondary-foreground rounded-md overflow-hidden bg-white hover:bg-gray-400"
                >
                  <span>{name}</span>
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
