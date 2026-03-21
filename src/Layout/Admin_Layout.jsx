import { Outlet } from "react-router-dom";
import Sidebar from "../component/shared/Sidebar";

export const Adminlayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-52">
        {/* Mobile header spacer */}
        <div className="h-14 lg:hidden" />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-5 lg:p-6">
          {/* Inner container (professional look) */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
