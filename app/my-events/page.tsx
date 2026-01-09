'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MyEventsPage from '@/components/MyEventsPage';
import Footer from '@/components/Footer';

export default function MyEventsPageRoute() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0F1116] flex items-center justify-center">
        <div className="text-white">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0F1116] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <MyEventsPage 
          onCreateEvent={() => router.push('/create-event')}
          onEditEvent={(eventId) => router.push(`/create-event?edit=${eventId}`)}
        />
      </main>
      <Footer />
    </div>
  );
}
