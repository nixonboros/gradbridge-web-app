import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

// Type for the signup data
type SignUpData = {
  accountType: 'personal' | 'company'
  fullName: string
  email: string
  password: string
}

// Function to handle user signup
export async function signUp({ accountType, fullName, email, password }: SignUpData) {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Insert the user into the database
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          account_type: accountType,
          full_name: fullName,
          email,
          password_hash: passwordHash,
        },
      ])
      .select()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
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

    if (fetchError) throw fetchError
    if (!user) throw new Error('User not found')

    // Verify the password
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) throw new Error('Invalid password')

    return { data: user, error: null }
  } catch (error) {
    return { data: null, error }
  }
}