import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

// Add types for createUserAndProfile
interface CreateUserAndProfileParams {
  accountType: 'personal' | 'company';
  fullName: string;
  email: string;
  password: string;
  profile: {
    age: string;
    location: string;
    role: string;
    linkedin: string;
    experience: any;
    resume?: File | null;
    profilePicture?: File | null;
  };
}

// Function to create user and profile in one go
export async function createUserAndProfile({ accountType, fullName, email, password, profile }: CreateUserAndProfileParams) {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Insert the user into the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          account_type: accountType,
          full_name: fullName,
          email,
          password_hash: passwordHash,
        },
      ])
      .select('id')
      .single()

    if (userError) throw userError;
    if (!userData?.id) throw new Error('Failed to create user');

    // Insert the profile into the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userData.id, // Use the same ID as the user
          age: profile.age ? Number(profile.age) : null,
          location: profile.location,
          role: profile.role || null,
          linkedin: profile.linkedin || null,
          experience: profile.experience || null,
          resume_url: null,
          profile_picture_url: null,
        },
      ])

    if (profileError) throw profileError;
    return { error: null };
  } catch (error) {
    console.error('Error in createUserAndProfile:', error);
    return { error };
  }
}

// Function to handle user login
export async function signIn(email: string, password: string) {
  try {
    // First, get the user by email
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (fetchError) {
      // If the error is because no rows were found, throw our custom error
      if (fetchError.code === 'PGRST116') {
        throw new Error('User not found')
      }
      throw fetchError
    }
    if (!user) throw new Error('User not found')

    // Verify the password
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) throw new Error('Invalid password')

    return { data: user, error: null }
  } catch (error) {
    return { data: null, error }
  }
}