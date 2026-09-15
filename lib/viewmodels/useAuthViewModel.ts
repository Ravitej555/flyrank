'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../services/authService';
import { AuthModel } from '../models/AuthModel';

export function useAuthViewModel() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUser(AuthModel.getSession());
  }, []);

  const openModal = useCallback(() => {
    setError(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setError(null);
  }, []);

  const handleLogin = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setError(null);
      try {
        const profile = AuthModel.login(email, name);
        setUser(profile);
        setIsModalOpen(false);
        setEmail('');
        setName('');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Authentication failed.');
      }
    },
    [email, name]
  );

  const handleDemoLogin = useCallback(() => {
    setError(null);
    const profile = AuthModel.loginDemo();
    setUser(profile);
    setIsModalOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    AuthModel.logout();
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isModalOpen,
    openModal,
    closeModal,
    email,
    setEmail,
    name,
    setName,
    error,
    handleLogin,
    handleDemoLogin,
    handleLogout,
  };
}
