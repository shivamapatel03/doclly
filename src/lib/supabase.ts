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

/**
 * Resolve the user's active plan tier with fallback to email, invoice records, and local storage
 */
export const resolveUserPlanTier = (
  email?: string,
  userId?: string,
  rawTier?: string
): 'free' | 'pro' | 'business' => {
  if (rawTier === 'pro' || rawTier === 'business') {
    return rawTier;
  }

  const cleanEmail = (email || '').toLowerCase().trim();

  // Explicit check for user email
  if (cleanEmail === 'shivamsenton@gmail.com') {
    return 'pro';
  }

  try {
    if (userId) {
      const invoicesRaw = localStorage.getItem(`doclly_invoices_${userId}`);
      if (invoicesRaw) {
        const invs = JSON.parse(invoicesRaw);
        if (invs.some((inv: any) => inv.planId === 'business')) return 'business';
        if (invs.some((inv: any) => inv.planId === 'pro')) return 'pro';
      }
    }
    if (cleanEmail) {
      const invoicesRaw = localStorage.getItem(`doclly_invoices_${cleanEmail}`);
      if (invoicesRaw) {
        const invs = JSON.parse(invoicesRaw);
        if (invs.some((inv: any) => inv.planId === 'business')) return 'business';
        if (invs.some((inv: any) => inv.planId === 'pro')) return 'pro';
      }
    }

    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        (parsed.email?.toLowerCase().trim() === cleanEmail || (userId && parsed.id === userId)) &&
        (parsed.planTier === 'pro' || parsed.planTier === 'business')
      ) {
        return parsed.planTier;
      }
    }
  } catch {}

  return 'free';
};

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

      const email = user.email || '';
      const planTier = resolveUserPlanTier(email, user.id, user.user_metadata?.plan_tier);

      // Auto-sync recognized Pro plan to Supabase user_metadata
      if (planTier !== 'free' && user.user_metadata?.plan_tier !== planTier) {
        supabase.auth.updateUser({ data: { plan_tier: planTier } }).catch(() => {});
      }

      const appUser: AppUser = {
        id: user.id,
        email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        provider: user.app_metadata?.provider || 'email',
        planTier,
        createdAt: user.created_at,
      };

      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
      return appUser;
    }

    // Fallback in-memory / local storage user
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.planTier = resolveUserPlanTier(parsed.email, parsed.id, parsed.planTier);
        return parsed;
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

        // Sync to active local user key and public users table
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
        supabase.from('users').upsert({
          id: user.id,
          email: user.email || email,
          full_name: name || user.email?.split('@')[0] || 'User',
        }).then();

        // If email confirmation is required by Supabase project settings
        if (data.session === null) {
          return {
            success: true,
            user: appUser,
            message: 'Sign up successful! Please check your email to confirm your account (or disable email confirmation in Supabase Project Settings).',
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
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
        return { success: true, user: appUser };
      }
      return { success: false, error: 'User not found' };
    }

    // Offline / Demo fallback
    const usersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_DB);
    const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!existing) {
      return {
        success: false,
        error: 'No account found with this email. Please create an account first.',
      };
    }

    if (existing.password && existing.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please check your credentials and try again.',
      };
    }

    const { password: _, ...cleanUser } = existing;
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(cleanUser));
    return { success: true, user: cleanUser };
  },

  /**
   * Sign in with Google OAuth — opens a popup so the page never redirects.
   * After the popup closes, polls Supabase for the new session.
   */
  async signInWithGoogle(): Promise<{ success: boolean; user?: AppUser; error?: string }> {
    if (supabase) {
      // Step 1: Get the OAuth URL without redirecting the main window
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      });

      if (error || !data?.url) {
        return { success: false, error: error?.message || 'Could not initiate Google sign-in.' };
      }

      // Step 2: Open the OAuth URL in a popup window
      return new Promise((resolve) => {
        const width = 500;
        const height = 650;
        const left = Math.round(window.screenX + (window.outerWidth - width) / 2);
        const top = Math.round(window.screenY + (window.outerHeight - height) / 2);
        const popup = window.open(
          data.url,
          'doclly_google_auth',
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );

        if (!popup) {
          resolve({ success: false, error: 'Popup was blocked. Please allow popups for this site and try again.' });
          return;
        }

        // Step 3: Poll until the popup closes, then fetch the session
        const interval = setInterval(async () => {
          if (popup.closed) {
            clearInterval(interval);
            clearTimeout(timeout);

            const { data: sessionData } = await supabase!.auth.getSession();
            if (sessionData.session?.user) {
              const u = sessionData.session.user;
              const appUser: AppUser = {
                id: u.id,
                email: u.email || '',
                name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'User',
                avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.picture,
                provider: 'google',
                planTier: (u.user_metadata?.plan_tier as any) || 'free',
                createdAt: u.created_at,
              };
              localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
              resolve({ success: true, user: appUser });
            } else {
              resolve({ success: false, error: 'Google sign-in was cancelled or the session could not be established.' });
            }
          }
        }, 500);

        // Timeout after 5 minutes
        const timeout = setTimeout(() => {
          clearInterval(interval);
          if (!popup.closed) popup.close();
          resolve({ success: false, error: 'Google sign-in timed out. Please try again.' });
        }, 300_000);
      });
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

      // Also persist to registered users DB
      const usersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_DB);
      if (usersRaw) {
        try {
          const users: any[] = JSON.parse(usersRaw);
          const updatedUsers = users.map((u) => (u.id === current.id ? { ...u, planTier: tier } : u));
          localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(updatedUsers));
        } catch {}
      }

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

      // Also persist to registered users DB
      const usersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_DB);
      if (usersRaw) {
        try {
          const users: any[] = JSON.parse(usersRaw);
          const updatedUsers = users.map((u) =>
            u.id === current.id ? { ...u, name: updated.name, avatarUrl: updated.avatarUrl } : u
          );
          localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(updatedUsers));
        } catch {}
      }

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
          const email = u.email || '';
          const planTier = resolveUserPlanTier(email, u.id, u.user_metadata?.plan_tier);

          if (planTier !== 'free' && u.user_metadata?.plan_tier !== planTier) {
            supabase.auth.updateUser({ data: { plan_tier: planTier } }).catch(() => {});
          }

          const appUser: AppUser = {
            id: u.id,
            email,
            name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'User',
            avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.picture,
            provider: u.app_metadata?.provider || 'email',
            planTier,
            createdAt: u.created_at,
          };
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(appUser));
          callback(appUser);
        } else {
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
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
