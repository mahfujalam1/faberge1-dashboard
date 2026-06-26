import { Outlet } from "react-router-dom";
import Sidebar from "../component/Main/Sidebar/Sidebar";
// import Header from "../component/Main/Header/Header";
import { useState } from "react";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <main className="w-full flex bg-gray-50 min-h-screen overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Main Content */}
      <section className="w-full md:w-[calc(100%-320px)] h-full md:ml-[320px]">
        {/* <div className="md:my-7 md:pt-0 pt-14">
          <Header toggleSidebar={toggleSidebar} />
        </div> */}
        <div className="md:pt-8 pt-16 md:px-3 bg-gradient-to-tl from-[#ffecec] via-[#ffe1e7] to-[#ffd4db]  min-h-screen w-full">
          <Outlet />
        </div>
      </section>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 px-10"
          onClick={toggleSidebar}
        ></div>
      )}
    </main>
  );
};
export default MainLayout;
