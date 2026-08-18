import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppUser, SupabaseAuthService, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  isSupabaseLive: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePlanTier: (tier: 'free' | 'pro' | 'business') => Promise<void>;
  updateProfile: (updates: { name?: string; avatarUrl?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    SupabaseAuthService.getCurrentUser().then((initialUser) => {
      setUser(initialUser);
      setIsLoading(false);
    });

    // Listen to changes
    const { unsubscribe } = SupabaseAuthService.onAuthStateChange((updatedUser) => {
      setUser(updatedUser);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await SupabaseAuthService.signIn(email, password);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const signUp = async (email: string, password: string, name: string) => {
    const res = await SupabaseAuthService.signUp(email, password, name);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const signInWithGoogle = async () => {
    const res = await SupabaseAuthService.signInWithGoogle();
    if (res.success && res.user) {
      // Popup resolved with the user directly — set it immediately
      setUser(res.user);
    } else if (res.success) {
      // Fallback: fetch current user in case onAuthStateChange fires first
      const u = await SupabaseAuthService.getCurrentUser();
      if (u) setUser(u);
    }
    return res;
  };

  const signOut = async () => {
    await SupabaseAuthService.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    return await SupabaseAuthService.resetPassword(email);
  };

  const updatePlanTier = async (tier: 'free' | 'pro' | 'business') => {
    const updated = await SupabaseAuthService.updatePlanTier(tier);
    if (updated) {
      setUser(updated);
    }
  };

  const updateProfile = async (updates: { name?: string; avatarUrl?: string }) => {
    const updated = await SupabaseAuthService.updateProfile(updates);
    if (updated) {
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSupabaseLive: isSupabaseConfigured(),
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePlanTier,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
