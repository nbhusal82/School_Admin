import { Outlet } from "react-router-dom";
import Sidebar from "../component/shared/Sidebar";

export const Adminlayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
 
      <Sidebar />


      <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-64">
      
        <div className="h-16 lg:hidden" />

        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
