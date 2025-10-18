import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Event {
  id: string
  title: string
  description: string | null
  date: string
  venue: string | null
  creator_wallet: string
  ticket_price: number | null
  max_tickets: number | null
  contract_address: string | null
  created_at: string
}

export interface Ticket {
  id: string
  event_id: string
  owner_wallet: string
  token_id: number | null
  seat_number: string | null
  purchase_price: number | null
  transaction_hash: string | null
  is_used: boolean
  created_at: string
  event?: Event // For joined queries
}

export interface Attendee {
  id: string
  wallet_address: string
  email: string | null
  name: string | null
  avatar_url: string | null
  bio: string | null
  social_links: any | null
  created_at: string
}