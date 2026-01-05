import { useAppDispatch, useAppSelector } from "@/hooks";
import { RxCross1 } from "react-icons/rx";
import { IoIosArrowForward } from "react-icons/io";
import { toggleSideBar } from "@/redux/sidebar.slice";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import LockBodyScroll from "@/utils/LockBodyScroll";

const SideBar = () => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { open } = useAppSelector((store) => store.sidebar);
  const { language } = useAppSelector((store) => store.settings);
  const { categories } = useAppSelector((state) => state.categoryInfo);
  const dispatch = useAppDispatch();

  LockBodyScroll(open)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        dispatch(toggleSideBar());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
   
  }, [drawerRef, dispatch]);

  return (
    <div>
      {open && (
        <div
          ref={drawerRef}
          className="fixed top-0 left-0 z-40 w-full md:w-72 lg:w-80 h-full bg-white shadow-lg dark:bg-gray-900 
                       transform transition-transform duration-300 ease-in-out overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Categories
            </h2>
            <Button
              variant="ghost"
              className="text-gray-700 bg-gray-100"
              type="button"
              onClick={() => {
                dispatch(toggleSideBar());
              }}
            >
              <RxCross1 size={24} />
            </Button>
          </div>

          <Link to={"/offers"}
            onClick={() => {
              dispatch(toggleSideBar());
            }}>
            <li className="flex mx-4 mt-4 bg-yellow-400 items-center justify-between px-4 py-2  hover:bg-yellow-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-all duration-150">
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                OFFERS
              </span>
              <IoIosArrowForward className="text-gray-500 dark:text-gray-400" />
            </li>
          </Link>

          {/* Category List */}
          <ul className="mt-4 px-4 space-y-2 overflow-y-auto max-h-[600px] sm:max-h-[500px] pb-12 mb-8">
            {categories.filter(({status}) => status === "ACTIVE" ).map(({ _id, name, alternativeName, slug }) => (
              <Link
                to={`/category/${slug}`}
                key={_id}
                onClick={() => {
                  dispatch(toggleSideBar());
                }}
              >
                <li className={`flex mt-0.5 items-center justify-between px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-all duration-150`}>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">
                    {language === "en" ? name.toLocaleUpperCase() :
                      alternativeName ? alternativeName?.toLocaleUpperCase() : name.toLocaleUpperCase()}
                  </span>
                  <IoIosArrowForward className="text-gray-500 dark:text-gray-400" />
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}

      {/* Overlay */}
      {open && (
        <div
          onClick={() => dispatch(toggleSideBar())}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default SideBar;
