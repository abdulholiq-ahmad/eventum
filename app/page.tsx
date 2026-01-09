'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // If authenticated, keep users off the landing page
  React.useEffect(() => {
    if (session?.user) {
      router.replace('/my-events');
    }
  }, [session?.user, router]);

  const handleCreateEvent = () => {
    if (session) {
      router.push('/create-event');
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1116] flex flex-col">
      <Navbar onOpenAuth={() => setIsLoginOpen(true)} />
      <main className="flex-1">
        <Hero 
          onExploreEvents={() => router.push('/events')}
          onCreateEvent={handleCreateEvent}
        />
      </main>
      <Footer />
      
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}

