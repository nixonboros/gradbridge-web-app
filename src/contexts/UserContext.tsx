import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface UserContextType {
  profilePicture: string | null;
  setProfilePicture: (url: string | null) => void;
  initial: string;
  setInitial: (initial: string) => void;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [initial, setInitial] = useState('#');
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const isMounted = useRef(true);
  const isInitialLoad = useRef(true);
  const previousUserId = useRef<string | null>(null);

  // Clear state when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchUserData = async (showLoading: boolean = false) => {
    if (!userId || !isMounted.current) {
      setProfilePicture(null);
      setInitial('#');
      setIsLoading(false);
      return;
    }

    try {
      if (showLoading) {
        setIsLoading(true);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isMounted.current) return;
      
      if (user.user_metadata?.full_name) {
        setInitial(user.user_metadata.full_name.trim().split(' ')[0][0].toUpperCase());
      }
      
      // Fetch profile picture URL
      const { data: profile } = await supabase
        .from('profiles')
        .select('profile_picture_url')
        .eq('id', userId)
        .single();
      
      if (!isMounted.current) return;

      if (profile?.profile_picture_url) {
        setProfilePicture(profile.profile_picture_url);
      } else {
        setProfilePicture(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (isMounted.current) {
        setProfilePicture(null);
        setInitial('#');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  // First effect to get the user ID and handle auth state changes
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!isMounted.current) return;
        
        if (user) {
          // If this is a different user than before, clear the old data immediately
          if (previousUserId.current !== user.id) {
            setProfilePicture(null);
            setInitial('#');
            setIsLoading(true);
            previousUserId.current = user.id;
          }
          setUserId(user.id);
        } else {
          setUserId(null);
          setProfilePicture(null);
          setInitial('#');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!isMounted.current) return;
      
      if (session?.user) {
        // If this is a different user than before, clear the old data immediately
        if (previousUserId.current !== session.user.id) {
          setProfilePicture(null);
          setInitial('#');
          setIsLoading(true);
          previousUserId.current = session.user.id;
        }
        setUserId(session.user.id);
      } else {
        setUserId(null);
        setProfilePicture(null);
        setInitial('#');
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Second effect to fetch user data when userId changes
  useEffect(() => {
    if (userId) {
      fetchUserData(true);
    }
  }, [userId]);

  // Handle window focus
  useEffect(() => {
    const handleFocus = () => {
      if (userId && !isInitialLoad.current) {
        fetchUserData(false);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [userId]);

  // Mark initial load as complete
  useEffect(() => {
    if (!isLoading && isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [isLoading]);

  const refreshUserData = async () => {
    if (userId) {
      await fetchUserData(true);
    }
  };

  return (
    <UserContext.Provider value={{ 
      profilePicture, 
      setProfilePicture, 
      initial, 
      setInitial, 
      isLoading,
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