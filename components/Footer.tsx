'use client';

import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 relative z-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">

        <div className="text-gray-500 text-xs md:text-sm">
          &copy; 2024 <span className="text-gray-300 font-medium tracking-wide">Eventum Inc.</span>
        </div>

        <div className="flex gap-6 text-xs md:text-sm text-gray-500 font-medium">
          <a href="#" className="hover:text-pink-400 transition-colors">Hujjatlar</a>
          <a href="#" className="hover:text-pink-400 transition-colors">Xavfsizlik</a>
          <a href="#" className="hover:text-pink-400 transition-colors">Yordam</a>
        </div>

        <div className="flex gap-4">
          <a href="#" className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-full"><Twitter size={16} /></a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-full"><Github size={16} /></a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-full"><Linkedin size={16} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
