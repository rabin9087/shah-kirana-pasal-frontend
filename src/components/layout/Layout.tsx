import Header from "../header/Header";
import Footer from "../footer/Footer";
import SideBar from "../SideBar/SideBar";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { ICategoryTypes, IProductTypes } from "@/types/index";
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


  const { open } = useAppSelector((Store => Store.sidebar))
  return (
    <div className={`flex flex-col border-2 bg-background ${open ? "h-screen overflow-hidden " : "min-h-screen"}`}>
      <Header data={data} types={types} setData={setData} />
      {/* <HeaderNav/> */}
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
