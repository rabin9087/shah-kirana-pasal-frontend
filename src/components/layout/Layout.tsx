import Header from "../header/Header";
import Footer from "../footer/Footer";
import SideBar from "../SideBar/SideBar";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { ICategoryTypes, IProductTypes } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/axios/category/category";
import { useEffect, useRef, useState } from "react";
import { setCategory } from "@/redux/category.slice";
// import { setProducts } from "@/redux/product.slice";

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  types?: "products" | "category" // Change this line to expect an array
  setData?: (data: IProductTypes[]) => void;
  data?: IProductTypes[],
  addClass?: string
}

const Layout: React.FC<LayoutProps> = ({ title, children, types, data, setData, addClass }) => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector(s => s.categoryInfo)
  const { data: cats = [] as ICategoryTypes[] } = useQuery<ICategoryTypes[]>({
    queryKey: ['categories'],
    queryFn: () => getAllCategories(),
    enabled: categories.length === 0
  });
  useEffect(() => {
    if (cats?.length) {
      dispatch(setCategory(cats))
    }
  }, [dispatch, cats.length])

  const [showHeader, setShowHeader] = useState(true);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;

      if (currentScrollTop > lastScrollTop.current && currentScrollTop > 50) {
        setShowHeader(false); // scrolling down
      } else {
        setShowHeader(true); // scrolling up
      }

      lastScrollTop.current = currentScrollTop <= 0 ? 0 : currentScrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { open } = useAppSelector((Store => Store.sidebar))
  return (
    <div className="flex flex-col min-h-screen bg-background"> {/* Ensures full-height layout */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-500 ${showHeader ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <Header data={data} types={types} setData={setData} />
      </div>

      <div className="flex flex-1 pt-[110px]"> {/* Makes the main content take available space */}
        {/* Sidebar */}
        <div
          className={`fixed top-[110px] left-0 z-50 transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        bg-background shadow-lg h-full w-[250px]`}
        >
          <SideBar />
        </div>

        {/* Content area */}
        <div className={`flex-1 ml-0 ${open ? "md:ml-[0px]" : ""} transition-all duration-300`}>
          <div className={`flex justify-center p-2 font-bold underline text-2xl ${addClass}`}>{title}</div>
          <div className="px-4">{children}</div>
        </div>
      </div>

      <Footer /> {/* Always sticks to bottom, due to flex layout */}
    </div>
  );

};

export default Layout;
