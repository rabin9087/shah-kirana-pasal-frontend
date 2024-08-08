import React, { useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import SideBar from "../SideBar/SideBar";
import { useAppSelector } from "@/hooks";
import { IProductTypes } from "@/types";
// import { setProducts } from "@/redux/product.slice";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
  types?: "products" | "" // Change this line to expect an array
  setData?: (data: IProductTypes[]) => void;
  data?: IProductTypes[]
}

const Layout: React.FC<LayoutProps> = ({ title, children, types, data, setData }) => {

  const { open } = useAppSelector((Store => Store.sidebar))
  return (
    <div className={`flex flex-col border-2 bg-background  ${open ? "h-screen overflow-hidden" : "min-h-screen "}`}>
      <Header data={data} types={types} setData={setData} />
      <main className="relative w-full gap-2 border-2 ">
        <SideBar />
        <div>
          <div className="flex justify-center p-2 font-bold underline text-2xl">{title}</div>
          {children}
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default Layout;
