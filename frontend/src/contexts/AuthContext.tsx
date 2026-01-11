"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, UserInfo } from '@/lib/api';

interface AuthContextType {
  user: UserInfo['user'] | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = apiClient.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userInfo = await apiClient.getCurrentUser();
      setUser(userInfo.user);
    } catch (error) {
      // Token is invalid, clear it
      apiClient.clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      // Fetch user info after successful login
      const userInfo = await apiClient.getCurrentUser();
      setUser(userInfo.user);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName?: string) => {
    try {
      await apiClient.signup({ email, password, full_name: fullName });
      // Don't set user on signup since email needs to be verified
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
    } catch (error) {
      // Clear token even if logout fails
      apiClient.clearToken();
      setUser(null);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const userInfo = await apiClient.getCurrentUser();
      setUser(userInfo.user);
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
