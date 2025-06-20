import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// Usar directamente los valores de las variables de entorno
const supabaseUrl = 'https://xuhcnmzpimhufnrpxrpf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1aGNubXpwaW1odWZucnB4cnBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNDMyNTcsImV4cCI6MjA2MTYxOTI1N30.PYZHL1D5p46eiJDb0OivdqYyZwpoZwC8Nxng1dv4g2c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})