import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import SideBar from "../SideBar/SideBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background ">
      <Header />
      <main className="flex-1 min-h-screen   w-full flex gap-2">
        <SideBar />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
