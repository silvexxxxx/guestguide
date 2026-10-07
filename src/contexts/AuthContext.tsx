import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { HostSubscription } from '@/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  subscription: HostSubscription | null;
  isSuperAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, hostName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Lista email SuperAdmin autorizzate (con fallback garantito)
const SUPERADMIN_EMAILS = [
  'silveriopintus@gmail.com',
  (import.meta.env.VITE_SUPERADMIN_EMAIL || '').toLowerCase().trim(),
].filter(Boolean);

export const isSuperAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return SUPERADMIN_EMAILS.includes(email.toLowerCase().trim());
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [subscription, setSubscription] = useState<HostSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = useCallback(async (userId: string, userEmail: string) => {
    if (!isSupabaseConfigured) return;
    const isUserOwner = isSuperAdminEmail(userEmail);

    try {
      const { data, error } = await supabase
        .from('host_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Errore lettura sottoscrizione:', error.message);
        // Fallback per SuperAdmin
        if (isUserOwner) {
          setSubscription({
            id: userId,
            userId: userId,
            email: userEmail,
            role: 'superadmin',
            accessType: 'lifetime',
            validUntil: null,
            maxProperties: 99,
            isActive: true,
          });
        }
        return;
      }

      if (data) {
        // Se è il SuperAdmin ma sul DB era ancora segnato come 'host', eleviamolo sul DB
        if (isUserOwner && (data.role !== 'superadmin' || data.access_type !== 'lifetime')) {
          await supabase
            .from('host_subscriptions')
            .update({
              role: 'superadmin',
              access_type: 'lifetime',
              valid_until: null,
              max_properties: 99,
              is_active: true,
            })
            .eq('user_id', userId);

          setSubscription({
            id: data.id,
            userId: data.user_id,
            email: data.email,
            role: 'superadmin',
            accessType: 'lifetime',
            validUntil: null,
            maxProperties: 99,
            isActive: true,
            adminNotes: data.admin_notes,
            createdAt: data.created_at,
          });
          return;
        }

        setSubscription({
          id: data.id,
          userId: data.user_id,
          email: data.email,
          role: isUserOwner ? 'superadmin' : data.role,
          accessType: isUserOwner ? 'lifetime' : data.access_type,
          validUntil: isUserOwner ? null : data.valid_until,
          maxProperties: isUserOwner ? 99 : data.max_properties,
          isActive: data.is_active,
          adminNotes: data.admin_notes,
          lsCustomerId: data.ls_customer_id,
          lsSubscriptionId: data.ls_subscription_id,
          createdAt: data.created_at,
        });
      } else {
        // Se la riga non esiste ancora, creiamola
        const newSub = {
          user_id: userId,
          email: userEmail,
          role: isUserOwner ? 'superadmin' : 'host',
          access_type: isUserOwner ? 'lifetime' : 'free_trial',
          valid_until: isUserOwner ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          max_properties: isUserOwner ? 99 : 1,
          is_active: true,
        };

        const { data: inserted, error: insertErr } = await supabase
          .from('host_subscriptions')
          .upsert(newSub, { onConflict: 'user_id' })
          .select()
          .single();

        if (!insertErr && inserted) {
          setSubscription({
            id: inserted.id,
            userId: inserted.user_id,
            email: inserted.email,
            role: inserted.role,
            accessType: inserted.access_type,
            validUntil: inserted.valid_until,
            maxProperties: inserted.max_properties,
            isActive: inserted.is_active,
            adminNotes: inserted.admin_notes,
            createdAt: inserted.created_at,
          });
        }
      }
    } catch (err) {
      console.error('Errore nel recupero sottoscrizione host:', err);
    }
  }, []);

  const refreshSubscription = useCallback(async () => {
    if (user) {
      await fetchSubscription(user.id, user.email || '');
    }
  }, [user, fetchSubscription]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSubscription(session.user.id, session.user.email || '');
      }
      setIsLoading(false);
    });

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchSubscription(session.user.id, session.user.email || '');
      } else {
        setSubscription(null);
      }
      setIsLoading(false);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, [fetchSubscription]);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase non è configurato. Controlla il file .env.') };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  };

  const signUp = async (email: string, password: string, hostName?: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase non è configurato. Controlla il file .env.') };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: hostName || '',
        },
      },
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setSubscription(null);
  };

  const isSuperAdmin = Boolean(
    isSuperAdminEmail(user?.email) || subscription?.role === 'superadmin'
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        subscription,
        isSuperAdmin,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere utilizzato all\'interno di un AuthProvider');
  }
  return context;
};
