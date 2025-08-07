import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axiosCustom from '@/lib/axios'; // ton instance personnalisée
import axios from 'axios';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; 
  onToken: (token: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onSuccess,onToken }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = tab === 'login' ? '/auth/login' : '/auth/register';
      const payload = tab === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await axiosCustom.post(url, payload);
      localStorage.setItem('token', res.data.token);
      onToken(res.data.token);
      onSuccess();
      onClose();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        alert(e.response?.data?.message || 'Erreur');
      } else {
        console.error('Erreur inconnue', e);
      }
    }    
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">{tab === 'login' ? 'Connexion' : 'Inscription'}</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={(val) => setTab(val as 'login' | 'register')} className="w-full mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <div className="flex flex-col gap-2">
              <Input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
              <Input name="password" placeholder="Mot de passe" type="password" onChange={handleChange} value={form.password} />
              <Button onClick={handleSubmit} disabled={loading}>Se connecter</Button>
            </div>
          </TabsContent>

          <TabsContent value="register">
            <div className="flex flex-col gap-2">
              <Input name="name" placeholder="Pseudo" onChange={handleChange} value={form.name} />
              <Input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
              <Input name="password" placeholder="Mot de passe" type="password" onChange={handleChange} value={form.password} />
              <Button onClick={handleSubmit} disabled={loading}>S`inscrire</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
