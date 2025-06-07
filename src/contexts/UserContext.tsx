import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface UserContextType {
  profilePicture: string | null;
  initial: string;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Cache keys
const USER_PROFILE_CACHE_KEY = 'gradbridge_user_profile';

interface CachedProfile {
  profilePicture: string | null;
  initial: string;
  userId: string;
  lastUpdated: number;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Initialize from cache immediately
  const cachedProfile = localStorage.getItem(USER_PROFILE_CACHE_KEY);
  const parsedCache: CachedProfile | null = cachedProfile ? JSON.parse(cachedProfile) : null;
  
  const [profilePicture, setProfilePicture] = useState<string | null>(parsedCache?.profilePicture ?? null);
  const [initial, setInitial] = useState(parsedCache?.initial ?? '#');
  const [session, setSession] = useState<Session | null>(null);

  // Update cache helper
  const updateCache = (data: Partial<CachedProfile>) => {
    const currentCache = localStorage.getItem(USER_PROFILE_CACHE_KEY);
    const parsedCache: CachedProfile | null = currentCache ? JSON.parse(currentCache) : null;
    
    const newCache: CachedProfile = {
      profilePicture: data.profilePicture ?? parsedCache?.profilePicture ?? null,
      initial: data.initial ?? parsedCache?.initial ?? '#',
      userId: data.userId ?? parsedCache?.userId ?? '',
      lastUpdated: Date.now()
    };
    
    localStorage.setItem(USER_PROFILE_CACHE_KEY, JSON.stringify(newCache));
  };

  // Fetch user data including profile picture
  const fetchUserData = async (user: User) => {
    console.log('[UserContext] Fetching user data for:', user.id);

    try {
      let newInitial = '#';
      // Get user metadata
      if (user.user_metadata?.full_name) {
        newInitial = user.user_metadata.full_name.trim().split(' ')[0][0].toUpperCase();
        console.log('[UserContext] Setting initial:', newInitial);
        setInitial(newInitial);
      }

      // Fetch profile picture
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('profile_picture_url')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('[UserContext] Error fetching profile:', profileError);
        throw profileError;
      }

      console.log('[UserContext] Profile fetch result:', { profile });
      
      const newProfilePicture = profile?.profile_picture_url || null;
      
      // Only update state and cache if data has changed
      if (newProfilePicture !== profilePicture) {
        setProfilePicture(newProfilePicture);
      }
      if (newInitial !== initial) {
        setInitial(newInitial);
      }

      // Update cache with new data
      updateCache({
        profilePicture: newProfilePicture,
        initial: newInitial,
        userId: user.id
      });

    } catch (error) {
      console.error('[UserContext] Error in fetchUserData:', error);
      // Don't clear the cache on error, keep showing the last known good state
    }
  };

  // Handle auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[UserContext] Initial session:', session?.user?.id);
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[UserContext] Auth state changed:', { event, userId: session?.user?.id });
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle session changes
  useEffect(() => {
    if (session?.user) {
      console.log('[UserContext] Session user found, fetching data');
      fetchUserData(session.user);
    } else {
      console.log('[UserContext] No session user, resetting state');
      setProfilePicture(null);
      setInitial('');
      localStorage.removeItem(USER_PROFILE_CACHE_KEY);
    }
  }, [session]);

  const refreshUserData = async () => {
    console.log('[UserContext] Manual refresh requested');
    if (session?.user) {
      await fetchUserData(session.user);
    }
  };

  return (
    <UserContext.Provider value={{ 
      profilePicture,
      initial,
      refreshUserData
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 