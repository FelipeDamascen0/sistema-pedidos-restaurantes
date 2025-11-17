// Tipos do banco de dados
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          plan: 'monthly' | 'annual'
          plan_expires_at: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          plan: 'monthly' | 'annual'
          plan_expires_at: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          plan?: 'monthly' | 'annual'
          plan_expires_at?: string
          user_id?: string
        }
      }
      products: {
        Row: {
          id: string
          created_at: string
          restaurant_id: string
          name: string
          description: string | null
          price: number
          category: string
          image_url: string | null
          is_visible: boolean
          order_index: number
        }
        Insert: {
          id?: string
          created_at?: string
          restaurant_id: string
          name: string
          description?: string | null
          price: number
          category: string
          image_url?: string | null
          is_visible?: boolean
          order_index?: number
        }
        Update: {
          id?: string
          created_at?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          price?: number
          category?: string
          image_url?: string | null
          is_visible?: boolean
          order_index?: number
        }
      }
      tables: {
        Row: {
          id: string
          created_at: string
          restaurant_id: string
          table_number: string
          qr_code_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          restaurant_id: string
          table_number: string
          qr_code_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          restaurant_id?: string
          table_number?: string
          qr_code_url?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          created_at: string
          restaurant_id: string
          table_id: string | null
          guest_id: string
          guest_name: string
          items: Json
          total: number
          status: 'em_andamento' | 'aguardando_pagamento' | 'pago'
          paid_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          restaurant_id: string
          table_id?: string | null
          guest_id: string
          guest_name: string
          items: Json
          total: number
          status?: 'em_andamento' | 'aguardando_pagamento' | 'pago'
          paid_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          restaurant_id?: string
          table_id?: string | null
          guest_id?: string
          guest_name?: string
          items?: Json
          total?: number
          status?: 'em_andamento' | 'aguardando_pagamento' | 'pago'
          paid_at?: string | null
        }
      }
    }
  }
}

// Tipos auxiliares
export type Restaurant = Database['public']['Tables']['restaurants']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Table = Database['public']['Tables']['tables']['Row']
export type Order = Database['public']['Tables']['orders']['Row']

export type OrderStatus = 'em_andamento' | 'aguardando_pagamento' | 'pago'
export type Plan = 'monthly' | 'annual'

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
  total: number
}

export interface GuestSession {
  guestId: string
  guestName: string
  restaurantId: string
  mesaId: string
}
