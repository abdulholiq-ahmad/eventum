'use client';

import React, { useState } from 'react';
import { Search, MapPin, Building2, Palette, Cpu, Coffee, Bitcoin, Dumbbell, Leaf, Heart, MonitorPlay, Users, Sparkles, Globe, Briefcase, ArrowRight } from 'lucide-react';

// Categories Data with Custom Styling
const CATEGORIES = [
    { 
        icon: Cpu, 
        label: "Texnologiyalar", 
        count: "3k+ tadbir", 
        gradient: "group-hover:from-blue-500/20 group-hover:to-cyan-500/20", 
        border: "group-hover:border-cyan-500/30", 
        iconColor: "text-cyan-400" 
    },
    { 
        icon: Palette, 
        label: "San'at va Madaniyat", 
        count: "800+ tadbir", 
        gradient: "group-hover:from-purple-500/20 group-hover:to-pink-500/20", 
        border: "group-hover:border-pink-500/30", 
        iconColor: "text-pink-400" 
    },
    { 
        icon: MonitorPlay, 
        label: "AI va Kelajak", 
        count: "1.2k+ tadbir", 
        gradient: "group-hover:from-emerald-500/20 group-hover:to-teal-500/20", 
        border: "group-hover:border-emerald-500/30", 
        iconColor: "text-emerald-400" 
    },
    { 
        icon: Heart, 
        label: "Salomatlik", 
        count: "950+ tadbir", 
        gradient: "group-hover:from-rose-500/20 group-hover:to-orange-500/20", 
        border: "group-hover:border-rose-500/30", 
        iconColor: "text-rose-400" 
    },
    { 
        icon: Bitcoin, 
        label: "Web3 va Kripto", 
        count: "500+ tadbir", 
        gradient: "group-hover:from-indigo-500/20 group-hover:to-violet-500/20", 
        border: "group-hover:border-indigo-500/30", 
        iconColor: "text-indigo-400" 
    },
    { 
        icon: Briefcase, 
        label: "Biznes va Karyera", 
        count: "2.5k+ tadbir", 
        gradient: "group-hover:from-amber-500/20 group-hover:to-yellow-500/20", 
        border: "group-hover:border-amber-500/30", 
        iconColor: "text-amber-400" 
    },
];

// Featured Calendars Data
const FEATURED_CALENDARS = [
    {
        id: 1,
        title: "Reading Rhythms Global",
        desc: "Not a book club. A reading party. Read with friends to live music...",
        logo: "https://i.pravatar.cc/150?u=reading",
        color: "bg-gray-800"
    },
    {
        id: 2,
        title: "Build Club",
        desc: "Sydney · The most collaborative AI community in the...",
        logo: "https://i.pravatar.cc/150?u=build",
        color: "bg-blue-900"
    },
    {
        id: 3,
        title: "South Park Commons",
        desc: "South Park Commons helps you get from -1 to 0. To learn more...",
        logo: "https://i.pravatar.cc/150?u=spc",
        color: "bg-gray-700"
    },
    {
        id: 4,
        title: "Design Buddies",
        desc: "Events for designers and all creatives across SF, online, and...",
        logo: "https://i.pravatar.cc/150?u=design",
        color: "bg-pink-900"
    },
    {
        id: 5,
        title: "Cursor Community",
        desc: "Cursor community meetups, hackathons, workshops taking...",
        logo: "https://i.pravatar.cc/150?u=cursor",
        color: "bg-black"
    },
    {
        id: 6,
        title: "Google DeepMind",
        desc: "We're a team of scientists, engineers, ethicists and more...",
        logo: "https://i.pravatar.cc/150?u=deepmind",
        color: "bg-blue-600"
    }
];

// Local Events Cities with Reliable High Quality Images
const CITIES = [
    { name: "Toshkent", count: "42", image: "https://images.unsplash.com/photo-1694508219602-094b8e390234?q=80&w=800&auto=format&fit=crop" },
    { name: "Samarqand", count: "12", image: "https://images.unsplash.com/photo-1628282302303-346765275630?q=80&w=800&auto=format&fit=crop" },
    { name: "Nyu-York", count: "156", image: "https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?q=80&w=800&auto=format&fit=crop" },
    { name: "London", count: "89", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop" },
    { name: "Dubay", count: "64", image: "https://images.unsplash.com/photo-1512453979798-5ea936a79402?q=80&w=800&auto=format&fit=crop" },
    { name: "Seul", count: "34", image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=800&auto=format&fit=crop" },
    { name: "Berlin", count: "28", image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=800&auto=format&fit=crop" },
    { name: "Istanbul", count: "45", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop" }
];

const REGIONS = [
    "Global", "Osiyo", "Yevropa", "Afrika", "Amerika"
];

const EventsPage: React.FC = () => {
  const [activeRegion, setActiveRegion] = useState("Global");

  return (
    <div className="w-full max-w-7xl mx-auto pt-24 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Tadbirlar afishasi</h1>
          <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">
             Yoningizdagi mashhur tadbirlarni o'rganing, kategoriyalar bo'yicha ko'rib chiqing yoki ajoyib jamoat kalendarlari bilan tanishing.
          </p>
      </div>

      {/* Categories Grid */}
      <div className="mb-24">
          <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-white tracking-wide text-sm">Kategoriyalar</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES.map((cat, idx) => (
                  <div 
                    key={idx} 
                    className={`relative h-36 rounded-2xl border border-white/5 bg-[#16181D] p-5 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl ${cat.border}`}
                  >
                      {/* Hover Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      
                      {/* Icon */}
                      <div className={`relative z-10 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${cat.iconColor} mb-2 backdrop-blur-sm`}>
                          <cat.icon size={20} />
                      </div>

                      {/* Content */}
                      <div className="relative z-10">
                          <h3 className="font-bold text-white text-sm leading-tight mb-1 group-hover:translate-x-1 transition-transform">{cat.label}</h3>
                          <p className="text-[11px] text-gray-500 font-medium group-hover:text-white/70 transition-colors tracking-wider">{cat.count}</p>
                      </div>

                      {/* Decorative Big Icon */}
                      <cat.icon className={`absolute -bottom-6 -right-6 w-28 h-28 ${cat.iconColor} opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-500 rotate-[-15deg] pointer-events-none group-hover:rotate-0 group-hover:scale-110`} />
                  </div>
              ))}
          </div>
      </div>

      {/* Featured Calendars */}
      <div className="mb-24">
           <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-white tracking-wide text-sm">Tanlangan kalendarlar</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURED_CALENDARS.map((cal) => (
                  <div key={cal.id} className="bg-[#16181D] hover:bg-[#1E2025] border border-white/5 hover:border-white/10 rounded-2xl p-6 relative cursor-pointer group transition-all duration-300">
                      <div className="flex justify-between items-start mb-5">
                          <div className={`w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-lg ${cal.color}`}>
                              <img src={cal.logo} alt={cal.title} className="w-full h-full object-cover" />
                          </div>
                          <button className="px-4 py-1.5 rounded-full bg-[#2A2D35] hover:bg-white hover:text-black text-xs font-bold text-gray-300 transition-all border border-white/5">
                              Obuna bo'lish
                          </button>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">{cal.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                          {cal.desc}
                      </p>
                  </div>
              ))}
          </div>
      </div>

      {/* Local Events */}
      <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
              <div>
                  <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-white tracking-wide text-sm">Shaharlar</h2>
                  </div>
                  <p className="text-gray-400 font-medium">Shahar hayotini kashf eting</p>
              </div>
              
              {/* Modern Tabs */}
              <div className="flex p-1 bg-white/5 rounded-xl backdrop-blur-sm overflow-x-auto no-scrollbar max-w-full">
                  {REGIONS.map(region => (
                      <button 
                        key={region}
                        onClick={() => setActiveRegion(region)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeRegion === region ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                      >
                          {region}
                      </button>
                  ))}
              </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CITIES.map((city, idx) => (
                  <div key={idx} className="group relative h-56 rounded-3xl overflow-hidden cursor-pointer isolate">
                      {/* Background Image */}
                      <img 
                        src={city.image} 
                        alt={city.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300"></div>
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col items-start transform transition-transform duration-300 group-hover:-translate-y-1">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-1 leading-none">{city.name}</h3>
                          <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                               <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                               <span className="text-xs md:text-sm font-medium text-gray-200">{city.count} tadbir</span>
                          </div>
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-white/20">
                          <ArrowRight size={14} className="text-white" />
                      </div>
                  </div>
              ))}
          </div>
          
          <div className="mt-8 flex justify-center">
               <button className="px-6 py-2.5 rounded-full border border-white/10 text-gray-400 text-sm font-medium hover:text-white hover:border-white/30 transition-all">
                   Barcha shaharlarni ko'rish
               </button>
          </div>
      </div>

    </div>
  );
};

export default EventsPage;