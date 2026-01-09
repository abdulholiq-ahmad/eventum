'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Share, ExternalLink, Calendar, MapPin, ChevronDown, Clock, User, CheckCircle2, MoreHorizontal, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';

interface EventDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onDelete?: (eventId: string) => void;
  onEdit?: (eventId: string) => void;
}

const EventDetailsSidebar: React.FC<EventDetailsSidebarProps> = ({ isOpen, onClose, event, onDelete, onEdit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Generate slug from event title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
  };

  const eventSlug = event?.title ? generateSlug(event.title) : '';

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      setIsRegistered(false); 
      setIsMenuOpen(false);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleRegister = () => {
      setIsRegistering(true);
      setTimeout(() => {
          setIsRegistering(false);
          setIsRegistered(true);
      }, 800);
  }

  const handleDelete = () => {
    if (window.confirm('Bu tadbirni o\'chirmoqchimisiz?')) {
      onDelete?.(event.id);
      setIsMenuOpen(false);
      onClose();
    }
  };

  const handleEdit = () => {
    onEdit?.(event.id);
    setIsMenuOpen(false);
    onClose();
  };

  const handleShare = () => {
    const eventUrl = `${window.location.origin}/event/${eventSlug}`;
    navigator.clipboard.writeText(eventUrl);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
  };

  if (!isVisible && !isOpen) return null;
  if (!event) return null;

  // Robust Date Parser for the Box View
  const dateStr = event.dateLabel || "";
  
  // 1. Find Day Number
  const dayMatch = dateStr.match(/(\d+)/);
  const boxDay = dayMatch ? dayMatch[0] : new Date().getDate();

  // 2. Find Month Name
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", 
                      "Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
  
  const words = dateStr.split(/[,\s]+/).filter((w: string) => w && w !== boxDay);
  let foundMonth = words.find((w: string) => monthNames.some(m => w.toLowerCase().startsWith(m.toLowerCase())));
  
  if (!foundMonth) {
      foundMonth = "JAN"; 
  }

  const boxMonth = foundMonth.substring(0, 3).toUpperCase();

  return createPortal(
    <div className={`fixed inset-0 z-[200] flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-all duration-300"
        onClick={onClose}
      ></div>

      {/* Floating Sidebar Container */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 py-3 pointer-events-none w-full max-w-[550px]">
        
        {/* The Card */}
        <div className={`pointer-events-auto w-full h-full bg-[#1A1D21] shadow-2xl rounded-[32px] transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] border border-white/10 flex flex-col overflow-hidden ${isOpen ? 'translate-x-0' : 'translate-x-[110%]'}`}>
            
            {/* Header Actions */}
            <div className="flex items-center justify-between px-6 py-5 bg-[#1A1D21] z-20">
                <button onClick={onClose} className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors md:hidden">
                    <ChevronDown className="rotate-90" size={24} />
                </button>
                
                <div className="flex items-center gap-2 md:w-full md:justify-between">
                    <button onClick={onClose} className="hidden md:flex p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                        <X size={24} />
                    </button>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleShare}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-full text-base font-medium text-gray-300 transition-colors border border-white/5 relative"
                        >
                            <Share size={18} />
                            <span>Ulashish</span>
                            {showCopiedMessage && (
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    Nusxalandi!
                                </div>
                            )}
                        </button>
                        <div className="relative" ref={menuRef}>
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                            >
                                <MoreHorizontal size={24} />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1D21] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    {onEdit && (
                                        <button
                                            onClick={handleEdit}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-white/5 transition-colors"
                                        >
                                            <Pencil size={18} className="text-gray-400" />
                                            <span className="text-base">Tahrirlash</span>
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={handleDelete}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                            <span className="text-base">O'chirish</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="px-6 md:px-8 pb-8">
                    
                    {/* Image Section - Large Square/Rect */}
                    <div className="relative aspect-square w-full rounded-3xl overflow-hidden mb-5 bg-gray-800 shadow-2xl border border-white/5 group">
                        <img 
                            src={process.env.NEXT_PUBLIC_UPLOAD_URL ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/uploads/${event.image}` : event.image}
                            alt={event.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Title */}
                    <div className="mb-3">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]">
                            {event.title}
                        </h1>
                    </div>

                    {/* Organizer Row - Below Title */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex -space-x-3">
                             {event.hosts?.map((host: any, i: number) => (
                                 <div key={i} className="w-8 h-8 rounded-full border border-[#1A1D21] bg-gray-800 overflow-hidden relative z-10">
                                     <img src={host.avatar} alt={host.name} className="w-full h-full object-cover" />
                                 </div>
                             ))}
                        </div>
                        <div className="text-base text-gray-400">
                             Tashkilotchi: <span className="text-gray-300 font-medium">{event.hosts?.[0]?.name}</span> 
                             {event.hosts?.length > 1 && ` va ${event.hosts.length - 1} boshqalar`}
                        </div>
                    </div>

                    {/* Share Link Display */}
                    {eventSlug && (
                        <div className="mb-6 p-3 bg-white/5 border border-white/10 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1">Tadbir havolasi:</p>
                            <p className="text-sm text-gray-300 font-mono break-all">
                                {window.location.origin}/event/{eventSlug}
                            </p>
                        </div>
                    )}

                    {/* Meta Info Grid - Boxed Side-by-Side Style */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        
                        {/* Date Box */}
                        <div className="flex items-center gap-3 p-2 rounded-2xl transition-colors hover:bg-white/5 -ml-2 cursor-pointer group/date">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center flex-shrink-0 group-hover/date:border-white/20 transition-colors">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5">{boxMonth}</span>
                                <span className="text-2xl font-bold text-white leading-none">{boxDay}</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-base font-bold text-white truncate w-full leading-tight">{event.dateLabel || "Sana noaniq"}</span>
                                <span className="text-sm text-gray-500 truncate w-full mt-0.5">{event.timeDisplay?.split('GMT')[0] || "Vaqt noaniq"}</span>
                            </div>
                        </div>

                        {/* Location Box */}
                        <div className="flex items-center gap-3 p-2 rounded-2xl transition-colors hover:bg-white/5 -ml-2 cursor-pointer group/loc">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover/loc:border-white/20 transition-colors">
                                <MapPin size={26} className="text-gray-400" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-base font-bold text-white truncate w-full leading-tight">{event.location}</span>
                                <span className="text-sm text-gray-500 truncate w-full mt-0.5">Manzilni ko'rish</span>
                            </div>
                        </div>

                    </div>

                    {/* Registration Card */}
                    <div className="bg-[#22252A] rounded-2xl p-5 border border-white/5 mb-6 relative overflow-hidden">
                        
                        <div className="relative z-10">
                            <h3 className="text-base font-semibold text-gray-400 mb-3">Ro'yxatdan o'tish</h3>
                            <div className="text-gray-200 text-base mb-5 leading-relaxed">
                                Tadbirga qo'shilish uchun ro'yxatdan o'ting. Joylar soni cheklangan.
                            </div>

                            {/* User Info Mock */}
                            <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-black/20 border border-white/5">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-[1px]">
                                    <img src="https://i.pravatar.cc/150?u=user" alt="User" className="w-full h-full rounded-full object-cover border-2 border-[#22252A]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white">Sizning akkauntingiz</span>
                                    <span className="text-xs text-gray-500">abdulholiq571@gmail.com</span>
                                </div>
                            </div>

                            {isRegistered ? (
                                <button disabled className="w-full h-14 bg-white/10 border border-white/10 text-white font-medium rounded-xl flex items-center justify-center gap-2 cursor-default text-lg">
                                    <CheckCircle2 size={20} />
                                    <span>Siz ro'yxatdan o'tgansiz</span>
                                </button>
                            ) : (
                                <button 
                                    onClick={handleRegister}
                                    disabled={isRegistering}
                                    className="w-full h-14 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden text-lg"
                                >
                                    {isRegistering ? (
                                        <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Bir bosishda qo'shilish</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Description Text Mock */}
                    <div className="space-y-5 text-gray-300 text-lg leading-relaxed font-normal mb-6">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                <img src={event.hosts?.[0]?.avatar} className="w-full h-full rounded-full opacity-80" />
                             </div>
                             <span className="text-base text-gray-400 font-medium">{event.hosts?.[0]?.name} taqdim etadi</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">Tadbir haqida</h3>
                        <p>
                            Ushbu tadbirda biz sun'iy intellektning kelajagi va biznes jarayonlariga ta'siri haqida suhbatlashamiz.
                        </p>
                        <p>
                            Spikerlarimiz o'z tajribalari bilan bo'lishadilar va amaliy maslahatlar beradilar. Networking qismi ham bo'ladi.
                        </p>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-[#1A1D21]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <User size={24} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-bold text-white">Abdulholiq</span>
                        <button className="text-sm text-gray-500 hover:text-white text-left transition-colors">Tashkilotchi bilan bog'lanish</button>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>,
    document.body
  );
};

export default EventDetailsSidebar;