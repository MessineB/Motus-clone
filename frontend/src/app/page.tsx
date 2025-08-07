'use client';

import { useState } from 'react';
import { Topbar } from '@/components/layout/Layout';
import GameBoard from '@/components/Game/GameBoard';
import AuthModal from '@/components/modal/AuthModal';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { isAuthenticated, login } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Topbar />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => setAuthOpen(false)}
        onToken={(token) => login(token)}
      />

      <main className="flex-1 flex justify-center items-start mt-10 px-4">
        <GameBoard onSignupClick={() => setAuthOpen(true)} />
      </main>
    </div>
  );
}
