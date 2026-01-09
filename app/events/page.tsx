'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import EventsPage from '@/components/EventsPage';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';

export default function EventsPageRoute() {
  const { data: session } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F1116] flex flex-col">
      <Navbar onOpenAuth={() => setIsLoginOpen(true)} />
      <main className="flex-1">
        <EventsPage />
      </main>
      <Footer />
      
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}
