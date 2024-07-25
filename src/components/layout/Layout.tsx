import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import SideBar from "../SideBar/SideBar";
import { useAppSelector } from "@/hooks";

const Layout = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const { open } = useAppSelector((Store => Store.sidebar))
  return (
    <div className={`flex flex-col border-2 bg-background  ${open ? "h-screen overflow-hidden" : "min-h-screen "}`}>
      <Header />
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
