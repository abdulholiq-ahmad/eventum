'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, MapPin, History, Calendar } from 'lucide-react';
import EventDetailsSidebar from './EventDetailsSidebar';

// Data Structure from API
interface APIEvent {
  _id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  location?: {
    name?: string;
    address?: string;
    type?: string;
  };
  host: {
    _id: string;
    name?: string;
    email: string;
  };
  attendees: Array<{ _id: string; name?: string; email: string }>;
  visibility: string;
  image?: string;
}

// Display Structure for UI
interface MyEvent {
  id: string;
  timeDisplay: string;
  title: string;
  hosts: { name: string; avatar: string }[];
  hostLabel: string;
  location: string;
  attendeeCount: number;
  attendeeAvatars: string[];
  status?: 'upcoming' | 'past';
  dateLabel?: string;
  image?: string;
}

interface EventGroup {
  dateLabel: string;
  isToday?: boolean;
  events: MyEvent[];
}

interface MyEventsPageProps {
  onCreateEvent: () => void;
  onEditEvent?: (eventId: string) => void;
}

const MyEventsPage: React.FC<MyEventsPageProps> = ({ onCreateEvent, onEditEvent }) => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null);
  const [events, setEvents] = useState<EventGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Failed to fetch');
        
        const data = await res.json();
        console.log('Fetched events data:', data);
        const apiEvents: APIEvent[] = data.data || [];

        // Filter events for current user (as attendee or host)
        const userEvents = apiEvents.filter((event: APIEvent) => 
          event.host._id === (session?.user as any)?.id || 
          event.attendees.some((a: any) => a._id === (session?.user as any)?.id)
        );

        // Group by date and separate upcoming/past
        const now = new Date();
        const grouped: Record<string, MyEvent[]> = {};

        userEvents.forEach((apiEvent: APIEvent) => {
          const startDate = new Date(apiEvent.startsAt);
          const dateKey = startDate.toLocaleDateString('uz-UZ', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          const timeDisplay = startDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });

          const myEvent: MyEvent = {
            id: apiEvent._id,
            timeDisplay,
            title: apiEvent.title,
            hosts: [{
              name: apiEvent.host.name || 'Unknown',
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiEvent.host._id}`,
            }],
            hostLabel: apiEvent.host.name || apiEvent.host.email,
            location: apiEvent.location?.name || apiEvent.location?.address || 'Joyni bilish mumkin emas',
            attendeeCount: apiEvent.attendees.length,
            attendeeAvatars: apiEvent.attendees
              .slice(0, 4)
              .map((a: any) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${a._id}`),
            status: startDate < now ? 'past' : 'upcoming',
            dateLabel: dateKey,
            image: apiEvent.image,
          };

          if (!grouped[dateKey]) {
            grouped[dateKey] = [];
          }
          grouped[dateKey].push(myEvent);
        });

        // Convert to EventGroups and sort by date
        const eventGroups: EventGroup[] = Object.entries(grouped)
          .map(([dateLabel, events]: [string, MyEvent[]]) => ({
            dateLabel,
            isToday: new Date(dateLabel).toDateString() === new Date().toDateString(),
            events: events.sort((a: MyEvent, b: MyEvent) => 
              new Date(a.timeDisplay).getTime() - new Date(b.timeDisplay).getTime()
            ),
          }))
          .sort((a: EventGroup, b: EventGroup) => new Date(a.dateLabel).getTime() - new Date(b.dateLabel).getTime());

        setEvents(eventGroups);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    if (!session?.user) {
      setIsLoading(false);
      return;
    }
    fetchEvents();
  }, [session?.user]);

  const handleDelete = async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete event');
      }

      // Refetch events to update the list
      await fetchEvents();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Tadbirni o\'chirishda xatolik yuz berdi');
    }
  };

  const handleEdit = (eventId: string) => {
    if (onEditEvent) {
      onEditEvent(eventId);
    }
  };

  const activeData = events
    .map(group => ({
      ...group,
      events: group.events.filter(e => e.status === activeTab),
    }))
    .filter(group => group.events.length > 0);

  return (
    <div className="w-full max-w-5xl mx-auto pt-10 pb-32 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col mb-8">
          {/* Main Header Row with Border Bottom */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10">
            {/* Title and Tabs */}
            <div className="flex items-end gap-8 justify-between w-full">
              <h1 className="text-4xl font-bold text-white tracking-tight pb-4">Tadbirlar</h1>
              
              {/* Tabs next to title */}
              <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setActiveTab('upcoming')}
                    className={`pb-4 text-base font-medium transition-colors relative ${activeTab === 'upcoming' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                      Bo'lajak
                      {activeTab === 'upcoming' && (
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"></div>
                      )}
                  </button>
                  <button 
                    onClick={() => setActiveTab('past')}
                    className={`pb-4 text-base font-medium transition-colors relative ${activeTab === 'past' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                      O'tib ketgan
                      {activeTab === 'past' && (
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"></div>
                      )}
                  </button>
              </div>
            </div>
          </div>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[400px]">
        
        {/* Animated Wrapper with Key for Tab Switching */}
        <div 
            key={activeTab} 
            className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.25,0.4,0.25,1)]"
        >
            {!isLoading && activeData.length > 0 ? (
                <>
                    {/* Timeline line */}
                    <div className="absolute left-[7px] top-3 bottom-0 w-[1px] bg-dashed border-l border-dashed border-gray-800"></div>

                    <div className="space-y-10">
                        {activeData.map((group, groupIndex) => (
                            <div key={groupIndex} className="relative pl-8">
                                
                                {/* Date Header */}
                                <div className="flex items-center gap-3 mb-4 -ml-8">
                                    <div className={`w-4 h-4 rounded-full border-4 relative z-10 bg-white border-[#0F1116] shadow-[0_0_0_1px_rgba(255,255,255,0.4)]`}></div>
                                    <h2 className="text-base font-medium text-white">
                                        {group.dateLabel}
                                    </h2>
                                </div>

                                {/* Events List Container - Horizontal Cards */}
                                <div className="space-y-4">
                                    {group.events.map((event: MyEvent) => (
                                        <div 
                                            key={event.id}
                                            onClick={() => setSelectedEvent({ ...event, dateLabel: group.dateLabel })}
                                            className="group relative transition-all duration-200 cursor-pointer overflow-hidden bg-[#1A1D23] border border-white/5 hover:border-white/10 rounded-2xl hover:bg-[#20242C]"
                                        >
                                            <div className="flex flex-col sm:flex-row gap-6 justify-between p-6">
                                                
                                                {/* Left Content */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                    <div>
                                                        {/* Time Row */}
                                                        <div className="flex items-center gap-2 text-[#FFD02B] text-[15px] font-medium mb-1.5">
                                                            {event.timeDisplay}
                                                        </div>

                                                        {/* Title */}
                                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight group-hover:text-gray-200 transition-colors">
                                                            {event.title}
                                                        </h3>
                                                        
                                                        {/* Host Info */}
                                                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1.5">
                                                            <div className="flex -space-x-1.5 flex-shrink-0">
                                                                {event.hosts.slice(0, 2).map((host, i) => (
                                                                    <img key={i} src={host.avatar} className="w-5 h-5 rounded-full border border-[#1A1D23]" alt={host.name} />
                                                                ))}
                                                            </div>
                                                            <span className="truncate">{event.hostLabel}</span>
                                                        </div>
                                                        
                                                        {/* Location */}
                                                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                                            <MapPin size={16} />
                                                            <span className="truncate">{event.location}</span>
                                                        </div>
                                                    </div>

                                                    {/* Footer Actions */}
                                                    <div className="flex items-center gap-3">
                                                        {/* Attendees */}
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex -space-x-2">
                                                                {event.attendeeAvatars.slice(0, 4).map((avatar, i) => (
                                                                    <img key={i} src={avatar} className="w-7 h-7 rounded-full border-2 border-[#1A1D23]" alt="" />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-500 bg-[#2A2D35] px-2 py-1 rounded-full">+{event.attendeeCount}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Info */}
                                                <div className="w-full sm:w-[150px] aspect-square rounded-xl overflow-hidden bg-gray-800 border border-white/5 flex-shrink-0 group-hover:border-white/20 transition-all flex items-center justify-center">
                                                    {event.image ? (
                                                        <img 
                                                            src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/uploads/${event.image}`}
                                                            alt={event.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="text-center text-gray-500">
                                                            <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                                                            <p className="text-xs">{event.attendeeCount} ta odam</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        ))}
                    </div>
                </>
            ) : (
                 // EMPTY STATE
                 <div className="flex flex-col items-center justify-center py-28 px-4 text-center">
                    <div className="relative mb-8">
                        <div className="relative w-32 h-32 bg-[#1A1D23] rounded-full border border-white/10 flex items-center justify-center shadow-2xl z-10 ring-1 ring-white/5">
                            {activeTab === 'upcoming' ? (
                                <Calendar size={48} className="text-gray-200 opacity-90" strokeWidth={1} />
                            ) : (
                                <History size={48} className="text-gray-400 opacity-90" strokeWidth={1} />
                            )}
                        </div>
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">
                        {activeTab === 'upcoming' ? "Hozircha rejalaringiz yo'q" : "Tarix topilmadi"}
                    </h3>
                    
                    <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed mb-10 font-normal">
                        {activeTab === 'upcoming' 
                            ? "Yangi imkoniyatlar eshigini oching. Do'stlaringiz bilan unutilmas onlarni yarating."
                            : "Siz qatnashgan barcha tadbirlar shu yerda saqlanadi."}
                    </p>

                    {activeTab === 'upcoming' && (
                        <button 
                            onClick={onCreateEvent}
                            className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 font-semibold text-neutral-950"
                        >
                            <span className="mr-2.5"><Plus size={20} /></span>
                            <span className="text-lg">Ilk tadbirni yaratish</span>
                        </button>
                    )}
                 </div>
            )}
        </div>
      </div>

      {selectedEvent && (
        <EventDetailsSidebar 
          isOpen={!!selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
          event={selectedEvent}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default MyEventsPage;