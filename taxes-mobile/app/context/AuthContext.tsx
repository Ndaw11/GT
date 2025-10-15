// app/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { loginRequest } from '@/services/api';

export type Role = 'conducteur' | 'agent';

interface AuthContextProps {
  token: string | null;
  role: Role | null;
  userId: number | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ access_token: string; role: Role; user_id?: number }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  role: null,
  userId: null,
  isAuthenticated: false,
  login: async () => ({ access_token: '', role: 'conducteur' } as any),
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const storage = {
    getItem: async (key: string) =>
      Platform.OS === 'web'
        ? localStorage.getItem(key)
        : await SecureStore.getItemAsync(key),
    setItem: async (key: string, value: string) =>
      Platform.OS === 'web'
        ? localStorage.setItem(key, value)
        : await SecureStore.setItemAsync(key, value),
    deleteItem: async (key: string) =>
      Platform.OS === 'web'
        ? localStorage.removeItem(key)
        : await SecureStore.deleteItemAsync(key),
  };

  // Chargement initial
  useEffect(() => {
    (async () => {
      const savedToken = await storage.getItem('token');
      const savedRole = await storage.getItem('role');
      const savedId = await storage.getItem('userId');

      setToken(savedToken ?? null);
      setRole((savedRole as Role) ?? null);
      setUserId(savedId ? Number(savedId) : null);
    })();
  }, []);

  // Connexion
  async function login(email: string, password: string) {
    const data = await loginRequest(email, password);
    // L'API doit renvoyer { access_token, role, user_id }
    if (!data?.access_token) throw new Error('Token manquant dans la réponse API');
    if (!data?.role) throw new Error('Role manquant dans la réponse API');

    setToken(data.access_token);
    setRole(data.role as Role);
    setUserId(data.user_id ?? null);

    await storage.setItem('token', data.access_token);
    await storage.setItem('role', data.role);
    if (data.user_id) await storage.setItem('userId', String(data.user_id));

    return data; // Retourner les données pour utilisation immédiate
  }

  // Déconnexion
  async function logout() {
    setToken(null);
    setRole(null);
    setUserId(null);
    await storage.deleteItem('token');
    await storage.deleteItem('role');
    await storage.deleteItem('userId');
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        userId,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};