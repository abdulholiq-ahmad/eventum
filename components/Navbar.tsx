'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { ArrowRight, User, LogOut, ChevronDown, Calendar, Plus, Compass } from 'lucide-react';

interface NavbarProps {
  onOpenAuth?: () => void;
  onLogoClick?: () => void;
  onExploreClick?: () => void;
  onMyEventsClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onLogoClick, onExploreClick, onMyEventsClick }) => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setDropdownOpen(false);
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const handleCreateEvent = () => {
    if (session) {
      router.push('/create-event');
    } else if (onOpenAuth) {
      onOpenAuth();
    }
  };

  const handleExplore = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      router.push('/events');
    }
  };

  const handleMyEvents = () => {
    if (session) {
      router.push('/my-events');
    } else if (onMyEventsClick) {
      onMyEventsClick();
    }
  };

  const handleHome = () => {
    if (onLogoClick) {
      onLogoClick();
      return;
    }
    if (session) {
      router.push('/my-events');
    } else {
      router.push('/');
    }
  };

  return (
    <nav className="w-full py-8 px-6 z-50 relative flex items-center justify-between">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Left Side - Logo and Navigation Links */}
        <div className="flex items-center gap-8 md:gap-10">
          {/* Logo */}
          <div onClick={handleHome} className="flex items-center cursor-pointer group">
            <span className="text-4xl font-bold tracking-tighter text-white group-hover:text-pink-400 transition-colors">
              Eventum<span className="text-pink-500">.</span>
            </span>
          </div>

          {/* Afishani ko'rish Link */}
          <button
            onClick={handleExplore}
            className="hidden md:flex items-center gap-2 text-lg font-medium text-gray-400 hover:text-white transition-colors group"
          >
            <Compass size={18} className="text-gray-500 group-hover:text-pink-400 transition-colors" />
            <span>Afishani ko&apos;rish</span>
          </button>

          {/* Mening tadbirlarim - Only for authenticated users */}
          {session?.user && (
            <button
              onClick={handleMyEvents}
              className="hidden md:flex items-center gap-2 text-lg font-medium text-gray-400 hover:text-white transition-colors group"
            >
              <Calendar size={18} className="text-gray-500 group-hover:text-pink-400 transition-colors" />
              <span>Mening tadbirlarim</span>
            </button>
          )}
        </div>

        {/* Right Side - Create Event and Profile */}
        <div className="flex items-center gap-8 md:gap-10">
          {session?.user ? (
             /* Authenticated State */
             <div className="flex items-center gap-8">
                 {/* Create Event - Text Style */}
                 <button
                    onClick={handleCreateEvent}
                    className="hidden md:flex items-center gap-2 text-lg font-medium text-gray-400 hover:text-white transition-colors group"
                  >
                    <Plus size={18} className="text-gray-500 group-hover:text-pink-400 transition-colors" />
                    <span>Tadbir yaratish</span>
                 </button>

                 {/* Profile Dropdown */}
                 <div className="relative">
                   <button
                     onClick={() => setDropdownOpen(!dropdownOpen)}
                     className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-[1px] cursor-pointer hover:scale-105 transition-transform flex items-center justify-center relative group"
                   >
                     <div className="w-full h-full rounded-full bg-[#0F1116] flex items-center justify-center overflow-hidden">
                        <span className="text-sm font-bold text-white">
                          {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase()}
                        </span>
                     </div>
                     <ChevronDown 
                       size={14} 
                       className={`absolute -bottom-1 -right-1 text-white bg-[#0F1116] rounded-full p-0.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                     />
                   </button>

                   {/* Dropdown Menu */}
                   {dropdownOpen && (
                     <div className="absolute top-full right-0 mt-2 w-56 bg-[#1E1E1E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                       {/* User Info */}
                       <div className="px-4 py-4 border-b border-white/5">
                         <p className="text-sm font-medium text-white">{session.user.name || 'User'}</p>
                         <p className="text-xs text-gray-500 mt-1">{session.user.email}</p>
                       </div>

                       {/* Logout Button */}
                       <button
                         onClick={handleLogout}
                         className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium"
                       >
                         <LogOut size={16} />
                         <span>Chiqish</span>
                       </button>
                     </div>
                   )}
                 </div>
             </div>
          ) : (
            /* Unauthenticated State - CTA Button */
            <button
                onClick={handleCreateEvent}
                className="group flex items-center px-8 py-3 rounded-full bg-white text-black text-lg font-medium shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300 active:scale-95 border border-transparent"
            >
                <span>Kirish</span>
                <div className="w-0 overflow-hidden opacity-0 group-hover:w-5 group-hover:opacity-100 transition-all duration-300 ease-in-out flex items-center justify-end">
                <ArrowRight size={20} strokeWidth={2.5} className="ml-1" />
                </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
