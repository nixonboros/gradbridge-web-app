import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UserContextType {
  profilePicture: string | null;
  setProfilePicture: (url: string | null) => void;
  initial: string;
  setInitial: (initial: string) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [initial, setInitial] = useState('#');
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // First effect to get the user ID
  useEffect(() => {
    const fetchUserId = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        setUserId(null);
      }
    };

    fetchUserId();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoading(true);
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Second effect to fetch user data when userId changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setProfilePicture(null);
        setInitial('#');
        setIsLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (user.user_metadata?.full_name) {
          setInitial(user.user_metadata.full_name.trim().split(' ')[0][0].toUpperCase());
        }
        
        // Fetch profile picture URL
        const { data: profile } = await supabase
          .from('profiles')
          .select('profile_picture_url')
          .eq('id', userId)
          .single();
        
        if (profile?.profile_picture_url) {
          setProfilePicture(profile.profile_picture_url);
        } else {
          setProfilePicture(null);
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [userId]);

  return (
    <UserContext.Provider value={{ profilePicture, setProfilePicture, initial, setInitial, isLoading }}>
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