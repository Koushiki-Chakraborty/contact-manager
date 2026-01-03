import React, { useContext } from "react";
import { ContactRound, Users, LogOut, Menu } from "lucide-react";
import clsx from "clsx";
import { AuthContext } from "../context/AuthContext";

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div
    onClick={onClick}
    className={clsx(
      "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors",
      active
        ? "bg-blue-50 text-blue-600"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    )}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </div>
);

const Layout = ({ children }) => {
  const { logout, isAuthenticated } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-sm">
              <ContactRound size={22} />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
              Connect<span className="text-blue-600">Hub</span>
            </h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={Users} label="Contacts" active />
        </nav>

        <div className="p-4 border-t border-gray-200">
          {isAuthenticated && (
            <SidebarItem icon={LogOut} label="Logout" onClick={logout} />
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.2 rounded-md text-white">
            <ContactRound size={20} />
          </div>
          <h1 className="text-lg font-extrabold tracking-tight text-gray-900">
            Connect<span className="text-blue-600">Hub</span>
          </h1>
        </div>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
          <Menu size={24} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen pb-20 md:pb-8">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 w-full flex justify-around p-2 z-10">
        <div className="flex flex-col items-center p-2 text-blue-600">
          <Users size={24} />
          <span className="text-xs font-medium mt-1">Contacts</span>
        </div>
        <div 
          className="flex flex-col items-center p-2 text-gray-500 cursor-pointer"
          onClick={logout}
        >
          <LogOut size={24} />
          <span className="text-xs font-medium mt-1">Logout</span>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
