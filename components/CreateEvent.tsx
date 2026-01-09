'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import { MapPin, AlignLeft, Image as ImageIcon, Globe, ChevronDown, ChevronLeft, ChevronRight, Ticket, UserCheck, Users, Pencil, ArrowUpFromLine, Video, Search, X, Check, Sparkles, Link, Plus, Heading1, Heading2, Quote, Minus, List, ListOrdered, Type, MoreHorizontal, Calendar as CalendarIcon, Clock } from 'lucide-react';

// Mock themes data 
const themes = [
  { id: 'minimal', name: 'Minimal', gradient: 'from-gray-700 to-gray-900', accent: 'bg-gray-500', text: 'text-gray-100' },
  { id: 'warp', name: 'Warp', gradient: 'from-indigo-500 via-purple-500 to-pink-500', accent: 'bg-indigo-400', text: 'text-white' },
  { id: 'kvant', name: 'Kvant', gradient: 'from-blue-600 to-cyan-400', accent: 'bg-cyan-300', text: 'text-white' },
  { id: 'emo', name: 'Emoji', gradient: 'from-yellow-400 to-orange-500', accent: 'bg-yellow-300', text: 'text-black' },
  { id: 'confetti', name: 'Konfetti', gradient: 'from-purple-600 to-red-500', accent: 'bg-pink-400', text: 'text-white' },
];

// Visibility Options
const VISIBILITY_OPTIONS = [
    { 
        id: 'public', 
        label: 'Ommaviy', 
        description: "Kalendaringizda ko'rinadi va tavsiya etilishi mumkin.", 
        icon: Globe 
    },
    { 
        id: 'private', 
        label: 'Shaxsiy', 
        description: "Ro'yxatda yo'q. Ro'yxatdan o'tish faqat havola orqali.", 
        icon: Sparkles 
    }
];

// Timezones Data
const TIMEZONES = [
    { label: 'Baker Island', value: 'GMT-12' },
    { label: 'Pago Pago', value: 'GMT-11' },
    { label: 'Honolulu', value: 'GMT-10' },
    { label: 'Anchorage', value: 'GMT-9' },
    { label: 'Los Angeles', value: 'GMT-8' },
    { label: 'Denver', value: 'GMT-7' },
    { label: 'Chicago', value: 'GMT-6' },
    { label: 'New York', value: 'GMT-5' },
    { label: 'Halifax', value: 'GMT-4' },
    { label: 'Rio de Janeiro', value: 'GMT-3' },
    { label: 'South Georgia', value: 'GMT-2' },
    { label: 'Azores', value: 'GMT-1' },
    { label: 'London', value: 'GMT+0' },
    { label: 'Berlin', value: 'GMT+1' },
    { label: 'Jerusalem', value: 'GMT+2' },
    { label: 'Moscow', value: 'GMT+3' },
    { label: 'Dubai', value: 'GMT+4' },
    { label: 'Tashkent', value: 'GMT+5' },
    { label: 'Dhaka', value: 'GMT+6' },
    { label: 'Bangkok', value: 'GMT+7' },
    { label: 'Singapore', value: 'GMT+8' },
    { label: 'Tokyo', value: 'GMT+9' },
    { label: 'Sydney', value: 'GMT+10' },
    { label: 'Noumea', value: 'GMT+11' },
    { label: 'Auckland', value: 'GMT+12' },
];

// Popular indices for "Popular" section
const POPULAR_INDICES = [17, 12, 7, 15, 21, 16]; // Tashkent, London, NY, Moscow, Tokyo, Dubai

// Mock Locations Database for Tashkent
const MOCK_LOCATIONS = [
    { id: 1, name: "Tashkent City Mall", address: "O'zbekiston shox ko'chasi, Toshkent", coords: "41.3115,69.2403" },
    { id: 2, name: "Magic City", address: "Bobur ko'chasi, 174, Toshkent", coords: "41.3040,69.2464" },
    { id: 3, name: "CAEx Uzbekistan", address: "Milliy Bog' ko'chasi, Toshkent", coords: "41.3392,69.2882" },
    { id: 4, name: "Humo Arena", address: "Beshag'och ko'chasi, Toshkent", coords: "41.3005,69.2435" },
    { id: 5, name: "Alisher Navoiy Nomidagi Katta Teatr", address: "Islom Karimov ko'chasi, Toshkent", coords: "41.3093,69.2713" },
    { id: 6, name: "Xalqlar Do'stligi Saroyi", address: "Furqat ko'chasi, Toshkent", coords: "41.3095,69.2396" },
];

// Helper for date formatting
const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
const shortMonths = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
const days = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan'];

const formatDateDisplay = (date: Date) => {
    const dayName = days[date.getDay()];
    const dayNum = date.getDate();
    const monthName = shortMonths[date.getMonth()];
    return `${dayName}, ${dayNum} ${monthName}`; 
};

const formatTimeDisplay = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

// Parser helpers
const parseDateInput = (input: string): Date | null => {
    const cleanInput = input.replace(/^[a-zA-Z]+,\s*/, '').trim(); 
    const currentYear = new Date().getFullYear();
    
    const textMatch = cleanInput.match(/^(\d+)\s+([a-zA-Z]+)/);
    if (textMatch) {
         const day = parseInt(textMatch[1]);
         const monthStr = textMatch[2].toLowerCase();
         const monthIndex = shortMonths.findIndex(m => m.toLowerCase().startsWith(monthStr) || monthStr.startsWith(m.toLowerCase()));
         if (monthIndex !== -1) {
             return new Date(currentYear, monthIndex, day);
         }
    }
    
    const numMatch = cleanInput.match(/^(\d+)[\.\/](\d+)/);
    if (numMatch) {
        const day = parseInt(numMatch[1]);
        const month = parseInt(numMatch[2]) - 1;
        if (month >= 0 && month <= 11) {
            return new Date(currentYear, month, day);
        }
    }

    return null;
}

const parseTimeInput = (input: string): {h: number, m: number} | null => {
    const match = input.match(/(\d{1,2})[:\.](\d{2})/);
    if (match) {
        const h = parseInt(match[1]);
        const m = parseInt(match[2]);
        if (h >= 0 && h < 24 && m >= 0 && m < 60) {
            return { h, m };
        }
    }
    return null;
}

const formatGMT = (value: string) => {
    if (value === 'GMT+0') return 'GMT+00:00';
    const match = value.match(/GMT([+-])(\d+)/);
    if (match) {
        const sign = match[1];
        const hours = match[2].padStart(2, '0');
        return `GMT${sign}${hours}:00`;
    }
    return value;
};

// --- RICH TEXT EDITOR TYPES & COMPONENTS ---

type BlockType = 'paragraph' | 'h1' | 'h2' | 'image' | 'quote' | 'divider' | 'ul' | 'ol';

interface ContentBlock {
    id: string;
    type: BlockType;
    content: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

interface DescriptionEditorProps {
    isOpen: boolean;
    onClose: () => void;
    blocks: ContentBlock[];
    setBlocks: React.Dispatch<React.SetStateAction<ContentBlock[]>>;
}

const DescriptionEditor: React.FC<DescriptionEditorProps> = ({ isOpen, onClose, blocks, setBlocks }) => {
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial block if empty
    useEffect(() => {
        if (blocks.length === 0) {
            setBlocks([{ id: generateId(), type: 'paragraph', content: '' }]);
        }
    }, [blocks, setBlocks]);

    useEffect(() => {
        if(isOpen) {
             document.body.style.overflow = 'hidden';
        } else {
             document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleContentChange = (id: string, newContent: string) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const newBlock: ContentBlock = { id: generateId(), type: 'paragraph', content: '' };
            const newBlocks = [...blocks];
            newBlocks.splice(index + 1, 0, newBlock);
            setBlocks(newBlocks);
            setTimeout(() => {
                const el = document.getElementById(`block-${newBlock.id}`);
                el?.focus();
            }, 0);
        }
        if (e.key === 'Backspace' && blocks[index].content === '' && blocks.length > 1) {
            e.preventDefault();
            const prevBlock = blocks[index - 1];
            const newBlocks = blocks.filter((_, i) => i !== index);
            setBlocks(newBlocks);
            if (prevBlock) {
                 setTimeout(() => {
                    const el = document.getElementById(`block-${prevBlock.id}`);
                    el?.focus();
                }, 0);
            }
        }
    };

    const transformBlock = (id: string, type: BlockType) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, type } : b));
        setMenuOpenId(null);
        setTimeout(() => {
            const el = document.getElementById(`block-${id}`);
            el?.focus();
        }, 0);
    };

    // Refined Slash Menu Options
    const menuOptions = [
        { type: 'paragraph', label: 'Matn', desc: 'Oddiy matn yozish', icon: Type },
        { type: 'h1', label: 'Katta sarlavha', desc: 'Bo\'lim sarlavhasi', icon: Heading1 },
        { type: 'h2', label: 'O\'rtacha sarlavha', desc: 'Kichik bo\'limlar uchun', icon: Heading2 },
        { type: 'ul', label: 'Ro\'yxat', desc: 'Belgili ro\'yxat yaratish', icon: List },
        { type: 'ol', label: 'Raqamli ro\'yxat', desc: 'Tartibli ro\'yxat yaratish', icon: ListOrdered },
        { type: 'quote', label: 'Iqtibos', desc: 'Muhim fikrni ajratib ko\'rsatish', icon: Quote },
        { type: 'divider', label: 'Ajratuvchi', desc: 'Bo\'limlarni ajratish', icon: Minus },
        { type: 'image', label: 'Rasm', desc: 'Kompyuterdan yuklash', icon: ImageIcon },
    ];

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            {/* Modal */}
            <div className="relative w-full h-full md:h-[90vh] md:max-w-4xl bg-[#161616] md:rounded-[24px] shadow-2xl flex flex-col overflow-hidden border border-white/5 animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-[#161616] z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                        <h3 className="text-base font-semibold text-white tracking-wide">Tadbir haqida</h3>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-5 py-2 text-base text-gray-400 hover:text-white transition-colors">
                            Bekor qilish
                        </button>
                        <button 
                            onClick={onClose}
                            className="px-7 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors text-base"
                        >
                            Saqlash
                        </button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 overflow-y-auto relative bg-[#161616]" ref={containerRef} onClick={() => {
                    // Focus on last block if clicked in empty space
                    if(blocks.length > 0) {
                        const lastId = blocks[blocks.length-1].id;
                        document.getElementById(`block-${lastId}`)?.focus();
                    }
                }}>
                    <div className="max-w-2xl mx-auto py-12 px-6 min-h-[500px]">
                        {blocks.map((block, index) => (
                            <div key={block.id} className="group relative flex items-start -ml-12 pl-12 mb-3">
                                
                                {/* Floating Menu Trigger - Only visible on hover/focus of the block line */}
                                <div className="absolute left-0 top-1.5 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMenuOpenId(menuOpenId === block.id ? null : block.id);
                                        }}
                                        className={`text-gray-500 hover:text-white hover:bg-white/10 p-1.5 rounded-md transition-colors ${menuOpenId === block.id ? 'text-white bg-white/10' : ''}`}
                                    >
                                        <Plus size={18} />
                                    </button>

                                    {/* Enhanced Dropdown Menu */}
                                    {menuOpenId === block.id && (
                                        <div className="absolute top-full left-0 mt-2 w-[320px] bg-[#1E1E1E] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 ring-1 ring-white/5">
                                            <div className="p-1.5 max-h-[400px] overflow-y-auto flex flex-col gap-0.5">
                                                <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                    Asosiy bloklar
                                                </div>
                                                {menuOptions.map((opt) => (
                                                    <button
                                                        key={opt.type}
                                                        onClick={() => transformBlock(block.id, opt.type as BlockType)}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-left group/btn transition-colors"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 group-hover/btn:text-white group-hover/btn:border-white/20 group-hover/btn:bg-white/10 transition-all">
                                                            <opt.icon size={18} strokeWidth={1.5} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-gray-200 group-hover/btn:text-white">{opt.label}</span>
                                                            <span className="text-xs text-gray-500">{opt.desc}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Content Renderer */}
                                <div className="flex-1 min-w-0 relative">
                                    {block.type === 'paragraph' && (
                                        <textarea
                                            id={`block-${block.id}`}
                                            value={block.content}
                                            onChange={(e) => {
                                                handleContentChange(block.id, e.target.value);
                                                e.target.style.height = 'auto';
                                                e.target.style.height = e.target.scrollHeight + 'px';
                                            }}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            placeholder={index === 0 ? "Tadbir haqida batafsil yozing..." : "Yozish uchun..."}
                                            className="w-full bg-transparent text-xl text-gray-300 placeholder-gray-600 focus:outline-none resize-none overflow-hidden py-1 leading-relaxed"
                                            rows={1}
                                            autoFocus={index === 0 && blocks.length === 1}
                                            onFocus={(e) => {
                                                 setActiveBlockId(block.id);
                                                 e.target.style.height = 'auto';
                                                 e.target.style.height = e.target.scrollHeight + 'px';
                                            }}
                                        />
                                    )}
                                    {block.type === 'h1' && (
                                        <input
                                            id={`block-${block.id}`}
                                            value={block.content}
                                            onChange={(e) => handleContentChange(block.id, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            placeholder="Katta sarlavha"
                                            className="w-full bg-transparent text-5xl font-bold text-white placeholder-gray-700 focus:outline-none py-3 mt-4 mb-2"
                                            autoFocus
                                            onFocus={() => setActiveBlockId(block.id)}
                                        />
                                    )}
                                    {block.type === 'h2' && (
                                        <input
                                            id={`block-${block.id}`}
                                            value={block.content}
                                            onChange={(e) => handleContentChange(block.id, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            placeholder="O'rtacha sarlavha"
                                            className="w-full bg-transparent text-3xl font-semibold text-white placeholder-gray-700 focus:outline-none py-2 mt-2 mb-1"
                                            autoFocus
                                            onFocus={() => setActiveBlockId(block.id)}
                                        />
                                    )}
                                    {block.type === 'quote' && (
                                        <div className="flex gap-4 border-l-4 border-pink-500/50 pl-5 py-2 my-2 bg-white/[0.02] rounded-r-xl">
                                            <textarea
                                                id={`block-${block.id}`}
                                                value={block.content}
                                                onChange={(e) => {
                                                    handleContentChange(block.id, e.target.value);
                                                    e.target.style.height = 'auto';
                                                    e.target.style.height = e.target.scrollHeight + 'px';
                                                }}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                placeholder="Iqtibos..."
                                                className="w-full bg-transparent text-2xl italic text-gray-200 placeholder-gray-600 focus:outline-none resize-none overflow-hidden font-serif"
                                                rows={1}
                                                autoFocus
                                                onFocus={() => setActiveBlockId(block.id)}
                                            />
                                        </div>
                                    )}
                                    {block.type === 'divider' && (
                                        <div className="py-6 cursor-default select-none group/divider" onClick={() => setActiveBlockId(block.id)}>
                                            <div className="h-px bg-white/10 w-full group-hover/divider:bg-white/30 transition-colors"></div>
                                        </div>
                                    )}
                                    {block.type === 'ul' && (
                                        <div className="flex items-start gap-3 pl-1">
                                            <div className="mt-3 w-2 h-2 rounded-full bg-white/60 flex-shrink-0"></div>
                                            <textarea
                                                id={`block-${block.id}`}
                                                value={block.content}
                                                onChange={(e) => {
                                                    handleContentChange(block.id, e.target.value);
                                                    e.target.style.height = 'auto';
                                                    e.target.style.height = e.target.scrollHeight + 'px';
                                                }}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                placeholder="Ro'yxat..."
                                                className="w-full bg-transparent text-xl text-gray-300 placeholder-gray-600 focus:outline-none resize-none overflow-hidden py-1 leading-relaxed"
                                                rows={1}
                                                autoFocus
                                                onFocus={() => setActiveBlockId(block.id)}
                                            />
                                        </div>
                                    )}
                                    {block.type === 'ol' && (
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 min-w-[24px] text-gray-500 font-mono text-lg select-none text-right">1.</div>
                                            <textarea
                                                id={`block-${block.id}`}
                                                value={block.content}
                                                onChange={(e) => {
                                                    handleContentChange(block.id, e.target.value);
                                                    e.target.style.height = 'auto';
                                                    e.target.style.height = e.target.scrollHeight + 'px';
                                                }}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                placeholder="Ro'yxat..."
                                                className="w-full bg-transparent text-xl text-gray-300 placeholder-gray-600 focus:outline-none resize-none overflow-hidden py-1 leading-relaxed"
                                                rows={1}
                                                autoFocus
                                                onFocus={() => setActiveBlockId(block.id)}
                                            />
                                        </div>
                                    )}
                                    {block.type === 'image' && (
                                        <div className="w-full p-12 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/40 transition-all cursor-pointer group/img my-6">
                                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-5 group-hover/img:scale-110 transition-transform">
                                                <ImageIcon size={36} className="text-gray-400 group-hover/img:text-white" />
                                            </div>
                                            <span className="text-lg font-medium text-gray-300 group-hover/img:text-white">Rasm yuklash</span>
                                            <span className="text-base text-gray-500 mt-1">yoki faylni shu yerga tashlang</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {/* Empty State / Bottom Padding */}
                        <div className="h-[200px]" onClick={() => {
                             if (blocks.length > 0) {
                                 // Add new paragraph at end if clicking way below
                                 const newBlock: ContentBlock = { id: generateId(), type: 'paragraph', content: '' };
                                 setBlocks([...blocks, newBlock]);
                                 setTimeout(() => {
                                     document.getElementById(`block-${newBlock.id}`)?.focus();
                                 }, 0);
                             }
                        }}></div>
                    </div>
                </div>

                {/* Footer Tips */}
                <div className="px-8 py-4 border-t border-white/5 bg-[#161616] flex items-center justify-between text-sm text-gray-600">
                    <div className="flex gap-4">
                        <span>Foydali: Matnni belgilang va formatlang</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles size={14} />
                        <span>AI yordamchi (tez orada)</span>
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
};

// --- CAPACITY MODAL ---

interface CapacitySettings {
  isLimited: boolean;
  maxCapacity: number;
  hasWaitlist: boolean;
}

interface CapacityModalProps {
    isOpen: boolean;
    onClose: () => void;
    capacitySettings: CapacitySettings;
    setCapacitySettings: (settings: CapacitySettings) => void;
    onSave: () => void;
}

const CapacityModal: React.FC<CapacityModalProps> = ({ isOpen, onClose, capacitySettings, setCapacitySettings, onSave }) => {
    const [localSettings, setLocalSettings] = useState(capacitySettings);

    useEffect(() => {
        setLocalSettings(capacitySettings);
    }, [capacitySettings, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        setCapacitySettings(localSettings);
        onSave();
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
             <div className="relative w-full max-w-md bg-[#1E1E1E] border border-white/10 rounded-2xl shadow-2xl p-6 transform transition-all animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-white">Sig'im sozlamalari</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Limit Capacity Toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="block text-lg font-medium text-white">Cheklangan sig'im</span>
                            <span className="text-sm text-gray-500">Qatnashchilar sonini cheklash</span>
                        </div>
                        <div 
                            onClick={() => setLocalSettings({...localSettings, isLimited: !localSettings.isLimited})}
                            className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${localSettings.isLimited ? 'bg-green-500' : 'bg-[#2A2D35]'}`}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${localSettings.isLimited ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </div>

                    {/* Capacity Input */}
                    {localSettings.isLimited && (
                        <div className="animate-in slide-in-from-top-2 duration-200">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Maksimal qatnashchilar</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input 
                                    type="number" 
                                    value={localSettings.maxCapacity}
                                    onChange={(e) => setLocalSettings({...localSettings, maxCapacity: parseInt(e.target.value) || 0})}
                                    className="w-full bg-[#141414] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-lg focus:outline-none focus:border-white/20 transition-colors"
                                />
                            </div>
                        </div>
                    )}

                    {/* Waitlist Toggle */}
                     <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                        <div>
                            <span className="block text-lg font-medium text-white">Kutish ro'yxati</span>
                            <span className="text-sm text-gray-500">Joylar to'lganda navbat hosil qilish (Tez orada)</span>
                        </div>
                        <div className="w-14 h-8 rounded-full p-1 bg-[#2A2D35]">
                             <div className="w-6 h-6 bg-gray-500 rounded-full shadow-md"></div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex gap-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors text-lg"
                    >
                        Bekor qilish
                    </button>
                    <button 
                        onClick={handleSave}
                        className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors text-lg"
                    >
                        Saqlash
                    </button>
                </div>
             </div>
        </div>,
        document.body
    );
};

// --- MAIN COMPONENT ---

interface CreateEventProps {
    onThemeChange?: (themeId: string) => void;
}

const CreateEvent: React.FC<CreateEventProps> = ({ onThemeChange }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;
  
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(themes[1]); 
  const [title, setTitle] = useState('');
  const [eventSlug, setEventSlug] = useState('');
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);

  // Generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
  };

  // Update slug when title changes
  useEffect(() => {
    if (title) {
      setEventSlug(generateSlug(title));
    }
  }, [title]);

  // Check authentication
  useEffect(() => {
    if (!session) {
      // Not authenticated, could redirect or show message
    }
  }, [session]);

  // Load event data when in edit mode
  useEffect(() => {
    if (isEditMode && editId && session) {
      setIsLoadingEvent(true);
      fetch(`/api/events/${editId}`)
        .then(res => res.json())
        .then(data => {
          const event = data.data;
          setTitle(event.title || '');
          setStartDate(new Date(event.startsAt));
          setEndDate(new Date(event.endsAt));
          setStartDateStr(formatDateDisplay(new Date(event.startsAt)));
          setStartTimeStr(formatTimeDisplay(new Date(event.startsAt)));
          setEndDateStr(formatDateDisplay(new Date(event.endsAt)));
          setEndTimeStr(formatTimeDisplay(new Date(event.endsAt)));
          
          if (event.location) {
            setSelectedLocation({
              name: event.location.name || '',
              address: event.location.address || '',
              coords: event.location.coords || ''
            });
          }
          
          if (event.description) {
            const blocks = event.description.split('\n').filter((line: string) => line.trim()).map((line: string) => ({
              type: 'paragraph' as const,
              content: line
            }));
            setDescriptionBlocks(blocks);
          }
          
          if (event.image) {
            setImagePreview(event.image);
            setEventImage(event.image);
          }
          
          setRequiresApproval(event.requiresApproval || false);
          
          if (event.capacity) {
            setCapacitySettings({
              isLimited: true,
              maxCapacity: event.capacity,
              hasWaitlist: false
            });
          }
          
          const tz = TIMEZONES.find(t => t.value === event.timezone);
          if (tz) setSelectedTimezone(tz);
          
          const vis = VISIBILITY_OPTIONS.find(v => v.id === event.visibility);
          if (vis) setSelectedVisibility(vis);
          
          setIsLoadingEvent(false);
        })
        .catch(err => {
          console.error('Failed to load event:', err);
          setError('Tadbirni yuklashda xatolik yuz berdi');
          setIsLoadingEvent(false);
        });
    }
  }, [isEditMode, editId, session]);

  // Editor State
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [descriptionBlocks, setDescriptionBlocks] = useState<ContentBlock[]>([]);
  
  // Image State
  const [eventImage, setEventImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Date & Time State
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setHours(new Date().getHours() + 1)));
  
  // Input String State
  const [startDateStr, setStartDateStr] = useState(formatDateDisplay(startDate));
  const [startTimeStr, setStartTimeStr] = useState(formatTimeDisplay(startDate));
  const [endDateStr, setEndDateStr] = useState(formatDateDisplay(endDate));
  const [endTimeStr, setEndTimeStr] = useState(formatTimeDisplay(endDate));

  // Picker State
  const [activePicker, setActivePicker] = useState<'start-date' | 'start-time' | 'end-date' | 'end-time' | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Timezone State
  const [selectedTimezone, setSelectedTimezone] = useState(TIMEZONES[17]); // Default Tashkent (Index 17)
  const [timezoneMenuOpen, setTimezoneMenuOpen] = useState(false);
  const [timezoneQuery, setTimezoneQuery] = useState('');
  const timezoneRef = useRef<HTMLDivElement>(null);

  // Visibility (Event Status) State
  const [selectedVisibility, setSelectedVisibility] = useState(VISIBILITY_OPTIONS[0]);
  const [visibilityMenuOpen, setVisibilityMenuOpen] = useState(false);
  const visibilityRef = useRef<HTMLDivElement>(null);

  // Location State
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<typeof MOCK_LOCATIONS>([]);
  const [selectedLocation, setSelectedLocation] = useState<{name: string, address: string, coords: string} | null>(null);
  const [onlineLink, setOnlineLink] = useState('');
  const locationRef = useRef<HTMLDivElement>(null);

  // Capacity Modal State
  const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false);
  const [capacitySettings, setCapacitySettings] = useState<CapacitySettings>({
      isLimited: false,
      maxCapacity: 50,
      hasWaitlist: false
  });

  // Calculate Limits
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + 1, 11, 31); 

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setActivePicker(null);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setLocationMenuOpen(false);
      }
      if (timezoneRef.current && !timezoneRef.current.contains(event.target as Node)) {
        setTimezoneMenuOpen(false);
      }
      if (visibilityRef.current && !visibilityRef.current.contains(event.target as Node)) {
        setVisibilityMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter locations when query changes
  useEffect(() => {
    if (locationQuery) {
        const filtered = MOCK_LOCATIONS.filter(loc => 
            loc.name.toLowerCase().includes(locationQuery.toLowerCase()) || 
            loc.address.toLowerCase().includes(locationQuery.toLowerCase())
        );
        // Limit to 4 results
        setFilteredLocations(filtered.slice(0, 4));
    } else {
        setFilteredLocations([]);
    }
  }, [locationQuery]);

  const handleThemeSelect = (theme: typeof themes[0]) => {
      setSelectedTheme(theme);
      if (onThemeChange) {
          onThemeChange(theme.id);
      }
  };

  const handleCapacitySave = () => {
      setIsCapacityModalOpen(false);
  };

  const handleLocationSelect = (loc: typeof MOCK_LOCATIONS[0]) => {
      setSelectedLocation({
          name: loc.name,
          address: loc.address,
          coords: loc.coords
      });
      setLocationMenuOpen(false);
      setLocationQuery('');
      setOnlineLink('');
  };

  const handleOnlineSelect = (name: string) => {
      setSelectedLocation({
          name: name,
          address: 'Online',
          coords: ''
      });
      setLocationMenuOpen(false);
      setOnlineLink('');
  }

  // --- Image Upload Handler ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Faqat rasm fayllarini yuklash mumkin');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Rasm hajmi 5MB dan kichik bo\'lishi kerak');
      return;
    }

    try {
      // Create preview using FileReader
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);

      // Upload file to server
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      setEventImage(data.url); // Store the public URL
      setError('');
    } catch (error) {
      console.error('Upload error:', error);
      setError('Rasmni yuklashda xatolik yuz berdi');
      setImagePreview(null);
    }
  };

  // --- Calendar Logic ---
  const [viewDate, setViewDate] = useState(new Date());

  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    
    const calendarDays = [];
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(new Date(year, month, i));
    }
    return calendarDays;
  };

  const handleDateSelect = (date: Date) => {
      if (!date) return;
      
      const targetDate = activePicker === 'start-date' ? startDate : endDate;
      const newDate = new Date(targetDate);
      newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());

      if (activePicker === 'start-date') {
          setStartDate(newDate);
          setStartDateStr(formatDateDisplay(newDate));
          if (endDate < newDate) {
              const newEnd = new Date(newDate);
              newEnd.setHours(newEnd.getHours() + 1);
              setEndDate(newEnd);
              setEndDateStr(formatDateDisplay(newEnd)); 
          }
      } else {
          setEndDate(newDate);
          setEndDateStr(formatDateDisplay(newDate)); 
      }
      setActivePicker(null);
  };

  const handleTimeSelect = (hour: number, minute: number) => {
      const targetDate = activePicker === 'start-time' ? startDate : endDate;
      const newDate = new Date(targetDate);
      newDate.setHours(hour);
      newDate.setMinutes(minute);

      if (activePicker === 'start-time') {
          setStartDate(newDate);
          setStartTimeStr(formatTimeDisplay(newDate));

          if (endDate <= newDate) {
               const newEnd = new Date(newDate);
               newEnd.setHours(newEnd.getHours() + 1);
               setEndDate(newEnd);
               setEndDateStr(formatDateDisplay(newEnd));
               setEndTimeStr(formatTimeDisplay(newEnd));
          }
      } else {
          setEndDate(newDate);
          setEndTimeStr(formatTimeDisplay(newDate));
      }
      setActivePicker(null);
  }

  // Manual Input Handlers
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>, isStart: boolean) => {
      const val = e.target.value;
      if (isStart) setStartDateStr(val); else setEndDateStr(val);

      const parsed = parseDateInput(val);
      if (parsed) {
          const current = isStart ? startDate : endDate;
          parsed.setHours(current.getHours(), current.getMinutes());
          
          if (isStart) {
              setStartDate(parsed);
              if (endDate < parsed) {
                  const newEnd = new Date(parsed);
                  newEnd.setHours(newEnd.getHours() + 1);
                  setEndDate(newEnd);
                  setEndDateStr(formatDateDisplay(newEnd));
              }
          } else {
              setEndDate(parsed);
          }
      }
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>, isStart: boolean) => {
      const val = e.target.value;
      if (!/^[0-9:.]*$/.test(val)) return;

      const parts = val.split(/[:\.]/);
      if (parts[0].length > 2) return; 
      if (parts[0].length > 0) {
          const h = parseInt(parts[0]);
          if (h > 23) return; 
      }
      if (parts[1]) {
          if (parts[1].length > 2) return; 
          const m = parseInt(parts[1]);
          if (m > 59) return; 
      }
      if (parts.length > 2) return;

      if (isStart) setStartTimeStr(val); else setEndTimeStr(val);

      const parsed = parseTimeInput(val);
      if (parsed) {
          const current = isStart ? startDate : endDate;
          const newDate = new Date(current);
          newDate.setHours(parsed.h, parsed.m);

          if (isStart) {
              setStartDate(newDate);
              if (endDate <= newDate) {
                  const newEnd = new Date(newDate);
                  newEnd.setHours(newEnd.getHours() + 1);
                  setEndDate(newEnd);
                  setEndDateStr(formatDateDisplay(newEnd));
                  setEndTimeStr(formatTimeDisplay(newEnd));
              }
          } else {
              setEndDate(newDate);
              setEndTimeStr(formatTimeDisplay(newDate));
          }
      }
  };

  const CalendarPicker = ({ selectedDate }: { selectedDate: Date }) => {
      const year = viewDate.getFullYear();
      const month = viewDate.getMonth();
      const daysGrid = generateCalendarDays(year, month);
      const isSameDay = (d1: Date, d2: Date) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
      const isPrevDisabled = (year < today.getFullYear()) || (year === today.getFullYear() && month <= today.getMonth());
      const isNextDisabled = (year > maxDate.getFullYear()) || (year === maxDate.getFullYear() && month >= maxDate.getMonth());

      return (
          <div className="p-5 w-[340px]">
              <div className="flex items-center justify-between mb-4">
                  <span className="text-white text-lg font-bold capitalize">{months[month].toLowerCase()} {year}</span>
                  <div className="flex gap-2">
                      <button 
                        disabled={isPrevDisabled}
                        onClick={(e) => { e.stopPropagation(); setViewDate(new Date(year, month - 1, 1)) }} 
                        className={`p-1.5 rounded-full transition-colors ${isPrevDisabled ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                      >
                          <ChevronLeft size={22} />
                      </button>
                      <button 
                        disabled={isNextDisabled}
                        onClick={(e) => { e.stopPropagation(); setViewDate(new Date(year, month + 1, 1)) }} 
                        className={`p-1.5 rounded-full transition-colors ${isNextDisabled ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                      >
                          <ChevronRight size={22} />
                      </button>
                  </div>
              </div>
              <div className="grid grid-cols-7 mb-2">
                  {['D', 'S', 'C', 'P', 'J', 'S', 'Y'].map(d => (
                      <div key={d} className="text-center text-sm text-gray-500 font-medium py-1">{d}</div>
                  ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                  {daysGrid.map((day, idx) => {
                      if (!day) return <div key={idx} />;
                      const isDisabled = day < today || day > maxDate;
                      return (
                          <div key={idx} className="aspect-square flex items-center justify-center">
                              <button 
                                  disabled={isDisabled}
                                  onClick={(e) => { e.stopPropagation(); handleDateSelect(day); }}
                                  className={`w-10 h-10 rounded-full text-base font-medium transition-all flex items-center justify-center
                                      ${isDisabled ? 'text-gray-700 cursor-default' : ''}
                                      ${!isDisabled && isSameDay(day, selectedDate) 
                                          ? 'bg-[#008080] text-white shadow-lg shadow-teal-900/50' 
                                          : !isDisabled ? 'text-gray-300 hover:bg-white/10 hover:text-white' : ''}
                                  `}
                              >
                                  {day.getDate()}
                              </button>
                          </div>
                      );
                  })}
              </div>
          </div>
      );
  };

  const TimePicker = () => {
      const times = [];
      for(let i=0; i<24; i++) {
          times.push({ h: i, m: 0 });
          times.push({ h: i, m: 30 });
      }

      return (
          <div className="h-[340px] overflow-y-auto no-scrollbar p-2 w-[180px]">
              {times.map((t, i) => {
                  const timeStr = `${t.h.toString().padStart(2, '0')}:${t.m.toString().padStart(2, '0')}`;
                  return (
                      <button 
                          key={i}
                          onClick={(e) => { e.stopPropagation(); handleTimeSelect(t.h, t.m); }}
                          className="w-full text-left px-5 py-3 text-lg text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-colors"
                      >
                          {timeStr}
                      </button>
                  )
              })}
          </div>
      );
  };

  // Filtered timezones
  const filteredTimezones = TIMEZONES.filter(tz => 
      tz.label.toLowerCase().includes(timezoneQuery.toLowerCase()) || 
      tz.value.toLowerCase().includes(timezoneQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto pt-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col lg:flex-row gap-12 lg:gap-20 relative">
      
      {/* LEFT SIDE - Vertical Invite Card Preview & Theme Selector */}
      <div className="w-full lg:w-[420px] flex flex-col gap-8 sticky top-8 self-start order-2 lg:order-1">
          
          <div className="text-sm font-bold text-gray-500 tracking-widest mb-1 pl-1">Ko'rinish</div>
          
          {/* Live Preview Card */}
          <div className="w-full aspect-[3/4] rounded-[40px] relative overflow-hidden transition-all duration-500 shadow-2xl group border border-white/10">
              {/* Image or Gradient Background */}
              {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Event preview" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
              ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${selectedTheme.gradient} transition-all duration-700`}></div>
              )}
              
              {/* Noise Texture */}
              <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

              {/* Removed hover upload overlay to keep UI minimal */}

              {/* Always-visible small change button (bottom-right) */}
              <div className="absolute bottom-4 right-4 z-30">
                  <label className="w-10 h-10 rounded-full bg-white/10 border border-white/30 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 hover:border-white/50 transition-colors">
                      <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                      />
                      <ImageIcon size={18} className="text-white" />
                  </label>
              </div>
          </div>
      </div>

      {/* RIGHT SIDE - Form Content */}
      <div className="flex-1 pt-2 order-1 lg:order-2">
        
        {/* Top Controls */}
        <div className="flex items-center justify-end mb-14">

            {/* Visibility Selector */}
            <div ref={visibilityRef} className="relative">
                <button 
                    onClick={() => setVisibilityMenuOpen(!visibilityMenuOpen)}
                    className="flex items-center gap-3 px-6 py-3 rounded-full bg-[#1E1E1E]/40 backdrop-blur-md border border-white/5 hover:border-white/10 hover:bg-[#1E1E1E]/60 text-base font-medium text-gray-200 transition-all"
                >
                    <selectedVisibility.icon size={18} className="text-gray-400" />
                    <span>{selectedVisibility.label}</span>
                    <ChevronDown size={18} className="text-gray-500 ml-1" />
                </button>

                {visibilityMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-[340px] bg-[#1E1E1E] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-2">
                        {VISIBILITY_OPTIONS.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => {
                                    setSelectedVisibility(option);
                                    setVisibilityMenuOpen(false);
                                }}
                                className="w-full text-left p-4 rounded-xl flex items-start gap-4 hover:bg-white/5 transition-colors group relative"
                            >
                                <div className="mt-0.5 text-gray-400 group-hover:text-white transition-colors">
                                    <option.icon size={22} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-base font-semibold text-white">{option.label}</span>
                                        {selectedVisibility.id === option.id && (
                                            <Check size={18} className="text-white" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 leading-relaxed">{option.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Title Input */}
        <div className="mb-14 relative group">
            <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tadbir nomi" 
                className="w-full bg-transparent text-7xl md:text-8xl font-bold text-white placeholder-gray-700 border-none focus:ring-0 p-0 bg-none outline-none tracking-tight transition-all placeholder:transition-colors group-hover:placeholder-gray-600"
                autoFocus
            />
        </div>

        {/* Form Groups Container */}
        <div className="space-y-8">

            {/* Date & Time Block */}
            <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl overflow-visible hover:border-white/10 transition-colors relative z-50">
                
                <div className="absolute top-0 bottom-0 left-0 w-20 z-10 pointer-events-none">
                     {/* Dotted Line */}
                    <div className="absolute left-1/2 top-[25%] bottom-[25%] -translate-x-1/2 border-l-2 border-dotted border-white/20"></div>

                    <div className="h-full flex flex-col">
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-3.5 h-3.5 rounded-full bg-gray-500/80 z-20"></div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-3.5 h-3.5 rounded-full border border-gray-500/80 z-20 bg-white/10"></div>
                        </div>
                    </div>
                </div>

                {/* Start Row */}
                <div className="flex items-center pl-20 py-3 relative pr-44 h-16">
                    <div className="w-36 text-gray-400 text-sm font-medium tracking-wide">Boshlanish</div>
                    <div className="flex-1 flex items-center gap-3 relative">
                        <input 
                            type="text"
                            value={startDateStr}
                            onChange={(e) => handleDateInputChange(e, true)}
                            onFocus={() => { setActivePicker('start-date'); setViewDate(startDate); }}
                            className={`w-[170px] px-5 py-2 rounded-xl text-left text-base font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 focus:bg-white/10 focus:border-white/30 transition-all duration-200 outline-none placeholder-gray-500 ${activePicker === 'start-date' ? 'bg-white/10 border-white/30' : ''}`}
                        />
                        <input 
                            type="text"
                            value={startTimeStr}
                            onChange={(e) => handleTimeInputChange(e, true)}
                            onFocus={() => { setActivePicker('start-time'); }}
                            className={`w-[110px] px-5 py-2 rounded-xl text-center text-base font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 focus:bg-white/10 focus:border-white/30 transition-all duration-200 outline-none placeholder-gray-500 ${activePicker === 'start-time' ? 'bg-white/10 border-white/30' : ''}`}
                        />

                        {(activePicker === 'start-date') && (
                            <div ref={pickerRef} className="absolute top-14 left-0 bg-[#1A1D21] border border-white/10 rounded-3xl shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <CalendarPicker selectedDate={startDate} />
                            </div>
                        )}
                         {(activePicker === 'start-time') && (
                            <div ref={pickerRef} className="absolute top-14 left-44 bg-[#1A1D21] border border-white/10 rounded-3xl shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <TimePicker />
                            </div>
                        )}
                    </div>
                </div>

                {/* End Row */}
                <div className="flex items-center pl-20 py-3 relative pr-44 h-16">
                    <div className="w-36 text-gray-400 text-sm font-medium tracking-wide">Tugash</div>
                    <div className="flex-1 flex items-center gap-3 relative">
                        <input 
                            type="text"
                            value={endDateStr}
                            onChange={(e) => handleDateInputChange(e, false)}
                            onFocus={() => { setActivePicker('end-date'); setViewDate(endDate); }}
                            className={`w-[170px] px-5 py-2 rounded-xl text-left text-base font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 focus:bg-white/10 focus:border-white/30 transition-all duration-200 outline-none placeholder-gray-500 ${activePicker === 'end-date' ? 'bg-white/10 border-white/30' : ''}`}
                        />
                         <input 
                            type="text"
                            value={endTimeStr}
                            onChange={(e) => handleTimeInputChange(e, false)}
                            onFocus={() => { setActivePicker('end-time'); }}
                            className={`w-[110px] px-5 py-2 rounded-xl text-center text-base font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 focus:bg-white/10 focus:border-white/30 transition-all duration-200 outline-none placeholder-gray-500 ${activePicker === 'end-time' ? 'bg-white/10 border-white/30' : ''}`}
                        />

                        {(activePicker === 'end-date') && (
                            <div ref={pickerRef} className="absolute top-14 left-0 bg-[#1A1D21] border border-white/10 rounded-3xl shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <CalendarPicker selectedDate={endDate} />
                            </div>
                        )}
                         {(activePicker === 'end-time') && (
                            <div ref={pickerRef} className="absolute top-14 left-44 bg-[#1A1D21] border border-white/10 rounded-3xl shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <TimePicker />
                            </div>
                        )}
                    </div>
                </div>

                {/* Timezone Info Dropdown */}
                <div ref={timezoneRef} className="absolute right-0 top-0 bottom-0 w-44">
                    <button 
                        onClick={() => { setTimezoneMenuOpen(!timezoneMenuOpen); setTimezoneQuery(''); }}
                        className={`w-full h-full flex flex-col items-start justify-center pl-8 transition-colors group focus:outline-none gap-2 ${timezoneMenuOpen ? 'bg-white/5' : 'hover:bg-white/5'}`}
                    >
                        <div className={`transition-colors ${timezoneMenuOpen ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                             <Globe size={24} />
                        </div>
                        <div className="flex flex-col items-start leading-none gap-2">
                            <span className={`text-lg font-bold tracking-tight transition-colors ${timezoneMenuOpen ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                                {formatGMT(selectedTimezone.value)}
                            </span>
                            <span className="text-sm font-medium text-gray-500 group-hover:text-gray-400 transition-colors truncate w-28 text-left">
                                {selectedTimezone.label}
                            </span>
                        </div>
                    </button>

                    {/* Timezone Dropdown List */}
                    {timezoneMenuOpen && (
                        <div className="absolute top-[calc(100%+12px)] right-0 w-[400px] bg-[#1E1E1E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-200 z-[100] ring-1 ring-white/5 flex flex-col max-h-[450px]">
                            
                            {/* Search Header */}
                            <div className="p-4 border-b border-white/5 sticky top-0 bg-[#1E1E1E] z-20">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={20} />
                                    <input 
                                        autoFocus
                                        type="text"
                                        value={timezoneQuery}
                                        onChange={(e) => setTimezoneQuery(e.target.value)}
                                        placeholder="Vaqt mintaqasini qidirish"
                                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-base rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-white/20 focus:bg-black/30 transition-colors placeholder:text-gray-600"
                                    />
                                </div>
                            </div>

                            {/* List */}
                            <div className="overflow-y-auto p-2 no-scrollbar">
                                
                                {/* Popular Section (Only when no query) */}
                                {!timezoneQuery && (
                                    <>
                                        <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider sticky top-0 bg-[#1E1E1E]">
                                            Mashhur shaharlar
                                        </div>
                                        {POPULAR_INDICES.map(idx => {
                                            const tz = TIMEZONES[idx];
                                            return (
                                                <button 
                                                    key={idx}
                                                    onClick={() => { setSelectedTimezone(tz); setTimezoneMenuOpen(false); }}
                                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg group transition-colors mb-0.5 ${selectedTimezone.value === tz.value ? 'bg-white/10' : 'hover:bg-white/5'}`}
                                                >
                                                    <span className={`text-base font-medium transition-colors ${selectedTimezone.value === tz.value ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                                        {tz.label}
                                                    </span>
                                                    <span className="text-sm text-gray-500 font-mono group-hover:text-gray-400 transition-colors">
                                                        {formatGMT(tz.value)}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                        <div className="h-px bg-white/5 mx-3 my-2"></div>
                                    </>
                                )}
                                
                                {filteredTimezones.length > 0 ? (
                                    filteredTimezones.map((tz, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => { setSelectedTimezone(tz); setTimezoneMenuOpen(false); setTimezoneQuery(''); }}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg group transition-colors mb-0.5 ${selectedTimezone.value === tz.value ? 'bg-white/10' : 'hover:bg-white/5'}`}
                                        >
                                            <span className={`text-base font-medium transition-colors ${selectedTimezone.value === tz.value ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                                {tz.label}
                                            </span>
                                            <span className="text-sm text-gray-500 font-mono group-hover:text-gray-400 transition-colors">
                                                {formatGMT(tz.value)}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                        Hech narsa topilmadi
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Location */}
            <div ref={locationRef} className="relative z-40">
                {selectedLocation ? (
                    /* SELECTED LOCATION MAP CARD */
                    <div className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                         {/* Header */}
                         <div className="bg-white/5 px-8 py-5 flex items-start justify-between relative">
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <MapPin className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white leading-tight">{selectedLocation.name}</h3>
                                    <p className="text-base text-gray-300 mt-1 opacity-90">{selectedLocation.address}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedLocation(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                         </div>
                         
                         {/* Map Body or Link Input */}
                         <div className="w-full bg-white/5 relative">
                             {selectedLocation.coords ? (
                                 <div className="h-[250px] bg-[#E5E3DF]">
                                     <iframe 
                                        width="100%" 
                                        height="100%" 
                                        scrolling="no" 
                                        src={`https://maps.google.com/maps?q=${selectedLocation.coords}&hl=uz&z=15&output=embed`}
                                        className="filter grayscale-[20%] contrast-[1.1]"
                                     ></iframe>
                                 </div>
                             ) : (
                                 <div className="w-full p-8 flex flex-col justify-center">
                                     <label className="text-sm font-medium text-gray-500 tracking-wide mb-3 flex items-center gap-2">
                                         <Link size={16} />
                                         {selectedLocation.name} Linki
                                     </label>
                                     <div className="relative group">
                                        <input 
                                            type="text" 
                                            value={onlineLink}
                                            onChange={(e) => setOnlineLink(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full bg-white/5 hover:bg-white/10 text-white px-5 py-4 rounded-xl border border-white/10 focus:border-white/20 focus:bg-black/30 focus:outline-none transition-all placeholder-gray-600 text-lg"
                                            autoFocus
                                        />
                                     </div>
                                 </div>
                             )}
                         </div>
                    </div>
                ) : (
                   /* Search Mode */
                    <div className="relative">
                        <div 
                            onClick={() => setLocationMenuOpen(true)}
                            className={`bg-white/5 backdrop-blur-md border ${locationMenuOpen ? 'border-white/20 bg-white/10' : 'border-white/5'} rounded-3xl flex items-center p-6 transition-all duration-200 cursor-text group hover:bg-white/10 min-h-[100px]`}
                        >
                            <div className="w-14 flex justify-center text-gray-500 group-hover:text-gray-300 transition-colors">
                                {locationMenuOpen ? <Search size={28} /> : <MapPin size={28} />}
                            </div>
                            
                            <div className="flex-1 ml-2">
                                {locationMenuOpen ? (
                                    <input 
                                        autoFocus
                                        value={locationQuery}
                                        onChange={(e) => setLocationQuery(e.target.value)}
                                        type="text" 
                                        placeholder="Joy yoki virtual havolani kiriting" 
                                        className="w-full bg-transparent text-xl text-white placeholder-gray-500 focus:outline-none"
                                    />
                                ) : (
                                    <div className="flex flex-col">
                                        <span className={`text-xl font-medium ${locationQuery ? 'text-white' : 'text-white'}`}>
                                            {locationQuery || "Tadbir o'tkaziladigan joyni qo'shing"}
                                        </span>
                                        {!locationQuery && (
                                            <span className="text-base text-gray-600 mt-1 group-hover:text-gray-500 transition-colors">Oflayn-joy yoki virtual havola</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {locationMenuOpen && (
                            <div className="absolute top-full left-0 w-full mt-3 bg-[#1E1E1E] rounded-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                                <div className="py-2 max-h-[350px] overflow-y-auto no-scrollbar">
                                    
                                    {/* Filtered Results */}
                                    {locationQuery && filteredLocations.length > 0 && (
                                        <div className="px-2 pb-2">
                                            <h4 className="px-4 py-3 text-xs font-semibold text-gray-500 tracking-wider">Qidiruv natijalari</h4>
                                            {filteredLocations.map(loc => (
                                                <button 
                                                    key={loc.id}
                                                    onClick={() => handleLocationSelect(loc)}
                                                    className="w-full flex items-center gap-5 px-4 py-4 hover:bg-white/5 rounded-2xl transition-colors text-left group"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white transition-all">
                                                        <MapPin size={24} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-lg text-gray-200 group-hover:text-white font-medium">{loc.name}</span>
                                                        <span className="text-base text-gray-500">{loc.address}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Recent Section */}
                                    {!locationQuery && (
                                        <div className="px-6 py-3">
                                            <h4 className="text-xs font-semibold text-gray-500 tracking-wider mb-3">Yaqinda ishlatilgan</h4>
                                            <div className="text-base text-gray-600 py-3 italic">Yaqinda ishlatilgan joylar yo'q</div>
                                            <div className="h-px bg-white/5 -mx-6 mt-3 mb-3"></div>
                                        </div>
                                    )}

                                    {/* Virtual Options */}
                                    {!locationQuery && (
                                        <div className="px-2">
                                            <h4 className="px-4 py-3 text-xs font-semibold text-gray-500 tracking-wider">Virtual variantlar</h4>
                                            
                                            <button 
                                                onClick={() => handleOnlineSelect('Zoom Meeting')}
                                                className="w-full flex items-center gap-5 px-4 py-4 hover:bg-white/5 rounded-2xl transition-colors text-left group"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-[#2D8CFF]/20 flex items-center justify-center text-[#2D8CFF] group-hover:bg-[#2D8CFF] group-hover:text-white transition-all">
                                                    <Video size={24} />
                                                </div>
                                                <span className="text-lg text-gray-200 group-hover:text-white">Zoom uchrashuvini yaratish</span>
                                            </button>

                                            <button 
                                                onClick={() => handleOnlineSelect('Google Meet')}
                                                className="w-full flex items-center gap-5 px-4 py-4 hover:bg-white/5 rounded-2xl transition-colors text-left group"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500 group-hover:bg-green-600 group-hover:text-white transition-all">
                                                    <Video size={24} />
                                                </div>
                                                <span className="text-lg text-gray-200 group-hover:text-white">Google Meet yaratish</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* Footer Info */}
                                    {!locationQuery && (
                                        <div className="px-8 py-5 mt-2">
                                            <p className="text-sm text-gray-500">Agar sizda havola bo'lsa, uni yuqoriga qo'yishingiz mumkin.</p>
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* Description Trigger */}
            <div 
                onClick={() => setIsDescriptionOpen(true)}
                className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl flex items-start p-6 hover:border-white/10 transition-colors cursor-text group min-h-[160px] hover:bg-white/10 z-0"
            >
                <div className="w-14 flex justify-center text-gray-500 group-hover:text-gray-300 pt-1.5 transition-colors">
                    <AlignLeft size={28} />
                </div>
                <div className="flex-1 ml-2">
                    {descriptionBlocks.length > 0 && descriptionBlocks[0].content !== '' ? (
                        <div className="text-white text-xl leading-relaxed line-clamp-4 opacity-90">
                            {descriptionBlocks.map(b => b.content).join(' ')}
                        </div>
                    ) : (
                        <div className="text-xl text-gray-500 font-normal leading-relaxed">
                            Tadbir tavsifi...
                        </div>
                    )}
                </div>
            </div>

            <DescriptionEditor 
                isOpen={isDescriptionOpen}
                onClose={() => setIsDescriptionOpen(false)}
                blocks={descriptionBlocks}
                setBlocks={setDescriptionBlocks}
            />

            {/* Settings */}
            <div className="pt-10 pb-3 px-2">
                <span className="text-base font-bold text-gray-500 tracking-wider">Sozlamalar</span>
            </div>

            {/* Settings List */}
            <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5 z-0">
                
                <div className="flex items-center justify-between p-6 px-8 hover:bg-white/[0.03] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-6 text-gray-400 group-hover:text-gray-200 transition-colors">
                        <Ticket size={24} />
                        <span className="text-lg font-medium">Chipta narxi</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-lg text-gray-500 group-hover:text-gray-400">Bepul</span>
                        <Pencil size={20} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
                    </div>
                </div>

                <div className="flex items-center justify-between p-6 px-8 hover:bg-white/[0.03] transition-colors">
                    <div className="flex items-center gap-6 text-gray-400 group-hover:text-gray-200 transition-colors">
                        <UserCheck size={24} />
                        <span className="text-lg font-medium">Tasdiqlash talab etiladi</span>
                    </div>
                    <div 
                        onClick={() => setRequiresApproval(!requiresApproval)}
                        className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${requiresApproval ? 'bg-green-500' : 'bg-[#2A2D35]'}`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${requiresApproval ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                </div>

                <div 
                    onClick={() => setIsCapacityModalOpen(true)}
                    className="flex items-center justify-between p-6 px-8 hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                    <div className="flex items-center gap-6 text-gray-400 group-hover:text-gray-200 transition-colors">
                        <Users size={24} />
                        <span className="text-lg font-medium">Sig'im</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-lg text-gray-500 group-hover:text-gray-400">
                            {capacitySettings.isLimited ? capacitySettings.maxCapacity : 'Cheklanmagan'}
                        </span>
                        <Pencil size={20} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
                    </div>
                </div>

            </div>

            <button 
              onClick={async () => {
                if (!title.trim()) {
                  setError('Tadbir nomini kiriting');
                  return;
                }
                if (!selectedLocation) {
                  setError('Joylashuv kiriting');
                  return;
                }
                if (startDate >= endDate) {
                  setError('Tugash vaqti boshlanish vaqtidan keyin bo\'lishi kerak');
                  return;
                }

                setIsCreating(true);
                setError('');
                try {
                  const url = isEditMode ? `/api/events/${editId}` : '/api/events';
                  const method = isEditMode ? 'PATCH' : 'POST';
                  
                  const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      title,
                      description: descriptionBlocks.map(b => b.content).join('\n'),
                      startsAt: startDate.toISOString(),
                      endsAt: endDate.toISOString(),
                      timezone: selectedTimezone.value,
                      visibility: selectedVisibility.id,
                      requiresApproval,
                      capacity: capacitySettings.isLimited ? capacitySettings.maxCapacity : undefined,
                      location: selectedLocation,
                      image: eventImage,
                    }),
                  });

                  if (!res.ok) {
                    const data = await res.json();
                    setError(data.error || `Tadbirni ${isEditMode ? 'yangilashda' : 'yaratishda'} xato`);
                    setIsCreating(false);
                    return;
                  }

                  // Success - navigate to my events page
                  router.push('/my-events');
                } catch (err) {
                  setError(`Tadbirni ${isEditMode ? 'yangilashda' : 'yaratishda'} xato`);
                  setIsCreating(false);
                }
              }}
              disabled={isCreating || isLoadingEvent}
              className="w-full mt-12 py-5 bg-white hover:bg-gray-100 disabled:opacity-50 text-black text-xl font-semibold rounded-2xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-[0.98] transform duration-200"
            >
              {isLoadingEvent ? 'Yuklanmoqda...' : isCreating ? (isEditMode ? 'Saqlanmoqda...' : 'Yaratilmoqda...') : (isEditMode ? 'Tadbirni saqlash' : 'Tadbirni yaratish')}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm">
                {error}
              </div>
            )}

        </div>
      </div>

      <CapacityModal 
        isOpen={isCapacityModalOpen} 
        onClose={() => setIsCapacityModalOpen(false)}
        capacitySettings={capacitySettings}
        setCapacitySettings={setCapacitySettings}
        onSave={handleCapacitySave}
      />

    </div>
  );
};

export default CreateEvent;