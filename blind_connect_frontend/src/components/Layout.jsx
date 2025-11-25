import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, User, MessageCircle, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Layout = ({ children }) => {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex flex-col items-center p-2 transition-all duration-300 relative group ${isActive ? 'text-brand-primary' : 'text-gray-500 hover:text-gray-300'}`}
      >
        {/* Glow effect for active tab */}
        {isActive && (
            <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full opacity-50" />
        )}
        <Icon size={24} strokeWidth={isActive ? 3 : 2} className="relative z-10" />
        <span className="text-[10px] mt-1 font-bold tracking-wide relative z-10">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 md:pb-0 md:pl-20 font-sans selection:bg-brand-primary selection:text-white">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-900 via-red-900 to-orange-900 opacity-50" />
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[128px]" />
         <div className="absolute top-10 left-10 w-64 h-64 bg-orange-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Desktop Sidebar / Mobile Bottom Bar */}
      <nav className="fixed bottom-0 md:left-0 md:top-0 w-full md:w-20 bg-black/80 backdrop-blur-xl border-t md:border-t-0 md:border-r border-white/10 flex md:flex-col justify-around md:justify-start items-center p-2 md:py-8 z-50">
        <div className="hidden md:block mb-12">
          <div className="bg-gradient-to-br from-orange-500 to-pink-600 p-2 rounded-xl shadow-[0_0_15px_rgba(234,88,12,0.5)]">
            <Flame className="text-white w-6 h-6" fill="white" />
          </div>
        </div>
        
        <div className="flex md:flex-col w-full justify-around gap-8">
          <NavItem to="/feed" icon={Flame} label="Feed" />
          <NavItem to="/matches" icon={MessageCircle} label="Chats" />
          <NavItem to="/profile" icon={User} label="Profile" />
        </div>

        <button 
          onClick={logout}
          className="hidden md:flex flex-col items-center mt-auto text-gray-600 hover:text-red-500 transition-colors"
        >
          <LogOut size={24} />
          <span className="text-[10px] mt-1 font-bold">Logout</span>
        </button>
      </nav>

      <main className="relative z-10 p-4 md:p-8 max-w-2xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;