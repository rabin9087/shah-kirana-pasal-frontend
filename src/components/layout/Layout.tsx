import Header from "../header/Header";
import Footer from "../footer/Footer";
import SideBar from "../SideBar/SideBar";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { ICategoryTypes, IProductTypes } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/axios/category/category";
import { useEffect } from "react";
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
  const { data: categories = [] } = useQuery<ICategoryTypes[]>({
    queryKey: ['categories'],
    queryFn: () => getAllCategories()
  });

  useEffect(() => {
    if (categories.length) {
      dispatch(setCategory(categories))
    }
  }, [dispatch, categories.length])
  

  const { open } = useAppSelector((Store => Store.sidebar))
  return (
    <div className={`flex flex-col border-2 bg-background ${open ? "h-screen overflow-hidden " : "min-h-screen"}`}>
      <Header data={data} types={types} setData={setData} />
      <main className="relative w-full gap-2 border-2 mb-2">
        <SideBar />
        <div>
          <div className={`flex justify-center p-2 font-bold underline text-2xl ${addClass}`}>{title}</div>
          {children}
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default Layout;
