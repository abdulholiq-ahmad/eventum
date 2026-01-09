'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CreateEvent from '@/components/CreateEvent';
import Footer from '@/components/Footer';

export default function CreateEventPageRoute() {
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
        <CreateEvent />
      </main>
      <Footer />
    </div>
  );
}
