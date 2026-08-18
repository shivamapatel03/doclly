import { createClient, SupabaseClient, User as SupabaseUser, Session } from '@supabase/supabase-js';

// Environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id')
  );
};

// Initialize real Supabase client if credentials are configured
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export interface AppUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider?: string;
  planTier?: 'free' | 'pro' | 'business';
  createdAt?: string;
}

// Local mock storage key for demo/offline fallback when Supabase keys are not set
const LOCAL_STORAGE_USER_KEY = 'doclly_active_user';
const LOCAL_STORAGE_USERS_DB = 'doclly_registered_users';

export const SupabaseAuthService = {
  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    if (supabase) {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Supabase getSession error:', error);
        return null;
      }
      return data.session;
    }
    return null;
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AppUser | null> {
    if (supabase) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      return {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatarUrl: user.user_metadata?.avatar_url,
        provider: user.app_metadata?.provider || 'email',
        planTier: (user.user_metadata?.plan_tier as any) || 'free',
        createdAt: user.created_at,
      };
    }

    // Fallback in-memory / local storage user
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Sign up with email, password, and full name
   */
  async signUp(email: string, password: string, name: string): Promise<{ success: boolean; user?: AppUser; message?: string; error?: string }> {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            plan_tier: 'free',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const user = data.user;
      if (user) {
        const appUser: AppUser = {
          id: user.id,
          email: user.email || email,
          name: name || user.email?.split('@')[0] || 'User',
          provider: 'email',
          planTier: 'free',
          createdAt: user.created_at,
        };
        // If email confirmation is required by Supabase project settings
        if (data.session === null) {
          return {
            success: true,
            user: appUser,
            message: 'Sign up successful! Please check your email to confirm your account.',
          };
        }
        return { success: true, user: appUser };
      }
      return { success: true, message: 'Please check your email for confirmation link.' };
    }

    // Offline / Demo fallback
    const usersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_DB);
    const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: AppUser = {
      id: 'usr_' + Date.now(),
      email,
      name: name || email.split('@')[0],
      provider: 'email',
      planTier: 'free',
      createdAt: new Date().toISOString(),
    };

    users.push({ ...newUser, password });
    localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(users));
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));

    return { success: true, user: newUser };
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<{ success: boolean; user?: AppUser; error?: string }> {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const user = data.user;
        const appUser: AppUser = {
          id: user.id,
          email: user.email || email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          avatarUrl: user.user_metadata?.avatar_url,
          provider: user.app_metadata?.provider || 'email',
          planTier: (user.user_metadata?.plan_tier as any) || 'free',
          createdAt: user.created_at,
        };
        return { success: true, user: appUser };
      }
      return { success: false, error: 'User not found' };
    }

    // Offline / Demo fallback
    const usersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_DB);
    const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!existing) {
      // If fresh demo, allow instant account creation or return friendly message
      const demoUser: AppUser = {
        id: 'usr_' + Date.now(),
        email,
        name: email.split('@')[0],
        provider: 'email',
        planTier: 'free',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
      return { success: true, user: demoUser };
    }

    const { password: _, ...cleanUser } = existing;
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(cleanUser));
    return { success: true, user: cleanUser };
  },

  /**
   * Sign in with Google OAuth (via Supabase or Google Identity Services SDK)
   */
  async signInWithGoogle(): Promise<{ success: boolean; user?: AppUser; error?: string }> {
    if (supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    }

    // Google Identity Services (GIS) direct popup with Client ID
    return new Promise((resolve) => {
      const googleClientId =
        import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        '142028544454-vu9j3f8ab1dbg3vrjgrdn0jlo1qe7l73.apps.googleusercontent.com';

      if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
        try {
          const client = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: googleClientId,
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
            callback: async (tokenResponse: any) => {
              if (tokenResponse && tokenResponse.access_token) {
                try {
                  const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                  });
                  if (userInfoRes.ok) {
                    const info = await userInfoRes.json();
                    const appUser: AppUser = {
                      id: 'google_' + (info.sub || Date.now()),
                      email: info.email || 'user@gmail.com',
                      name: info.name || info.email?.split('@')[0] || 'Google User',
                      avatarUrl: info.picture,
                      provider: 'google',
                      planTier: 'free',
                      createdAt: new Date().toISOString(),
                    };
                    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
                    resolve({ success: true, user: appUser });
                    return;
                  }
                } catch (e) {
                  console.error('Failed to fetch user info from Google:', e);
                }
              }
              resolve({ success: false, error: 'Google sign-in was cancelled or failed.' });
            },
            error_callback: (err: any) => {
              console.error('Google OAuth error:', err);
              resolve({ success: false, error: err?.message || 'Google OAuth failed.' });
            },
          });
          client.requestAccessToken();
          return;
        } catch (err: any) {
          console.error('Google client initialization error:', err);
        }
      }

      // Offline / fallback demo profile
      const googleUser: AppUser = {
        id: 'google_' + Date.now(),
        email: 'user.google@gmail.com',
        name: 'Google User',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        provider: 'google',
        planTier: 'pro',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(googleUser));
      resolve({ success: true, user: googleUser });
    });
  },

  /**
   * Send Password Reset Link
   */
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    }

    // Offline fallback
    return { success: true };
  },

  /**
   * Update User Plan Tier (Free, Pro, Business)
   */
  async updatePlanTier(tier: 'free' | 'pro' | 'business'): Promise<AppUser | null> {
    if (supabase) {
      await supabase.auth.updateUser({
        data: { plan_tier: tier },
      });
    }

    const current = await this.getCurrentUser();
    if (current) {
      const updated = { ...current, planTier: tier };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
      return updated;
    }
    return null;
  },

  /**
   * Update Profile Info (Full Name, Avatar)
   */
  async updateProfile(updates: { name?: string; avatarUrl?: string }): Promise<AppUser | null> {
    if (supabase) {
      await supabase.auth.updateUser({
        data: {
          full_name: updates.name,
          avatar_url: updates.avatarUrl,
        },
      });
    }

    const current = await this.getCurrentUser();
    if (current) {
      const updated = {
        ...current,
        name: updates.name || current.name,
        avatarUrl: updates.avatarUrl || current.avatarUrl,
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
      return updated;
    }
    return null;
  },

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  },

  /**
   * Subscribe to auth changes
   */
  onAuthStateChange(callback: (user: AppUser | null) => void): { unsubscribe: () => void } {
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const u = session.user;
          callback({
            id: u.id,
            email: u.email || '',
            name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User',
            avatarUrl: u.user_metadata?.avatar_url,
            provider: u.app_metadata?.provider || 'email',
            planTier: (u.user_metadata?.plan_tier as any) || 'free',
            createdAt: u.created_at,
          });
        } else {
          callback(null);
        }
      });
      return { unsubscribe: () => subscription.unsubscribe() };
    }

    // Fallback listener for localStorage changes
    const handler = () => {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      callback(saved ? JSON.parse(saved) : null);
    };
    window.addEventListener('storage', handler);
    return {
      unsubscribe: () => window.removeEventListener('storage', handler),
    };
  },
};
