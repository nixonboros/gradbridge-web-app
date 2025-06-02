import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UserContextType {
  profilePicture: string | null;
  setProfilePicture: (url: string | null) => void;
  initial: string;
  setInitial: (initial: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [initial, setInitial] = useState('#');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (user.user_metadata?.full_name) {
          setInitial(user.user_metadata.full_name.trim().split(' ')[0][0].toUpperCase());
        }
        
        // Fetch profile picture URL
        const { data: profile } = await supabase
          .from('profiles')
          .select('profile_picture_url')
          .eq('id', user.id)
          .single();
        
        if (profile?.profile_picture_url) {
          setProfilePicture(profile.profile_picture_url);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ profilePicture, setProfilePicture, initial, setInitial }}>
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