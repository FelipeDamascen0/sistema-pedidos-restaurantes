import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

// Valores padrão para evitar erros quando variáveis não estão configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Verifica se as variáveis de ambiente estão configuradas
const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Cria o cliente apenas se as variáveis estiverem configuradas
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Cliente para uso no servidor (com service role key se necessário)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
)

// Exporta flag para verificar se está configurado
export const isSupabaseConfigured = isConfigured
