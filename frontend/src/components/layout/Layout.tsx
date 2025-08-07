'use client';

import { useState } from 'react';
import AuthModal from '../modal/AuthModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export const Topbar = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <div className="flex justify-between p-4 border-b">
      <h1 className="text-xl font-bold">MOTDLE</h1>

      {isAuthenticated ? (
        <Button variant="outline" onClick={logout}>Se déconnecter</Button>
      ) : (
        <Button onClick={() => setAuthOpen(true)}>Connexion / Inscription</Button>
      )}

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          setAuthOpen(false);
        }}
        onToken={(token) => login(token)}
      />
    </div>
  );
};
