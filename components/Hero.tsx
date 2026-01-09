'use client';

import React from 'react';
import { ArrowUpRight, MapPin, CalendarClock } from 'lucide-react';

interface HeroProps {
  onOpenAuth?: () => void;
  onExploreEvents?: () => void;
  onCreateEvent?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenAuth, onExploreEvents, onCreateEvent }) => {
  const handleCreateClick = onCreateEvent || onOpenAuth;
  const handleExploreClick = onExploreEvents || onOpenAuth;
  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center my-auto">
        
        {/* Left Side - Text Content */}
        <div className="flex flex-col items-start text-left z-20 order-2 lg:order-1">
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.05] drop-shadow-2xl">
              Ajoyib voqealar <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">shu yerdan</span> <br/>
              boshlanadi.
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-xl leading-relaxed font-normal">
              Tadbir sahifasini yarating. Do‘stlaringizni taklif qiling. Chiptalarni soting.
            </p>

            {/* White Button with Vibrant Gradient Border */}
            <div className="w-full sm:w-auto">
              <button 
                onClick={handleCreateClick}
                className="relative inline-flex h-16 overflow-hidden rounded-full p-[2px] focus:outline-none group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(236,72,153,0.5)] transition-all duration-500 hover:scale-[1.02]"
              >
                {/* Gradient Border Animation - Purple to Pink */}
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#a855f7_50%,#ec4899_100%)] opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Button Content */}
                <span className="relative z-10 inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-10 text-lg font-medium text-black transition-all duration-300 group-hover:bg-opacity-95">
                  Birinchi tadbirni yaratish
                </span>
              </button>
            </div>
        </div>

        {/* Right Side - Fan of Cards Design */}
        <div className="relative hidden lg:flex items-center justify-center h-[650px] w-full order-1 lg:order-2 perspective-1000">
            
            {/* Atmospheric Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-[80px]"></div>

            {/* Cards Container - Group name added for focus blur effect */}
            <div className="relative w-full h-full flex items-center justify-center group/cards">
                
                {/* Left Card (Back) - Concert/Party */}
                <div className="absolute z-10 transform-gpu [backface-visibility:hidden] will-change-transform translate-x-[-70px] translate-y-[-20px] rotate-[-15deg] scale-90 opacity-60 hover:opacity-100 hover:scale-100 hover:translate-x-[-190px] hover:rotate-[-5deg] hover:z-50 transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer group group-hover/cards:blur-[1.5px] hover:!blur-[0px]">
                     <div className="w-[300px] h-[400px] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative bg-[#0F1116] transition-all duration-700">
                        <img 
                            src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop" 
                            alt="Neon Night" 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1116] via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="text-xs font-bold text-purple-400 mb-2 block">Nightlife</span>
                            <h3 className="text-white font-bold text-xl leading-tight">Neon Jazz Night</h3>
                        </div>
                     </div>
                </div>

                {/* Right Card (Back) - Art/Workshop */}
                <div className="absolute z-10 transform-gpu [backface-visibility:hidden] will-change-transform translate-x-[70px] translate-y-[-20px] rotate-[15deg] scale-90 opacity-60 hover:opacity-100 hover:scale-100 hover:translate-x-[190px] hover:rotate-[5deg] hover:z-50 transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer group group-hover/cards:blur-[1.5px] hover:!blur-[0px]">
                     <div className="w-[300px] h-[400px] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative bg-[#0F1116] transition-all duration-700">
                        <img 
                            src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2080&auto=format&fit=crop" 
                            alt="Art Gallery" 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1116] via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="text-xs font-bold text-yellow-400 mb-2 block">Art & Design</span>
                            <h3 className="text-white font-bold text-xl leading-tight">Modern Art Expo</h3>
                        </div>
                     </div>
                </div>

                {/* Center Card (Front) - Main Event */}
                <div className="absolute z-30 transform-gpu [backface-visibility:hidden] cursor-default">
                     <div className="w-[380px] h-[550px] bg-[#0F1116] rounded-[48px] overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] relative flex flex-col antialiased">
                        
                        {/* Image Section */}
                        <div className="h-[58%] relative overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop" 
                                alt="Main Event"
                                className="w-full h-full object-cover" 
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1116] via-transparent to-transparent opacity-90"></div>
                            
                            {/* Top Badges */}
                            <div className="absolute top-6 right-6 flex gap-2">
                                <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
                                    <span className="relative flex h-2.5 w-2.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                    </span>
                                    <span className="text-xs font-bold text-white tracking-wide">Sotuvda</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="h-[42%] px-8 pb-8 pt-0 flex flex-col justify-between relative bg-[#0F1116] transform-gpu translate-z-0">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                   <span className="text-sm font-semibold text-pink-400 tracking-wide">Tech Conference</span>
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-3 leading-[1.05] tracking-tight">Tashkent <br/> Tech Summit</h3>
                                <div className="flex items-center text-gray-400 gap-2.5 text-base">
                                    <MapPin size={16} />
                                    <span>CAEx, Tashkent</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                                        <CalendarClock size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400">Vaqti</span>
                                        <span className="text-base font-bold text-white">24 Okt, 09:00</span>
                                    </div>
                                </div>
                                <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all hover:scale-110 duration-300 shadow-lg shadow-white/10">
                                    <ArrowUpRight size={24} />
                                </button>
                            </div>
                        </div>
                     </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default Hero;