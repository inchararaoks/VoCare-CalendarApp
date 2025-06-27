import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!


export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          created_at: string
          firstname: string | null
          lastname: string | null
          birth_date: string | null
          care_level: number | null
          pronoun: string | null
          email: string | null
          active: boolean | null
          active_since: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          firstname?: string | null
          lastname?: string | null
          birth_date?: string | null
          care_level?: number | null
          pronoun?: string | null
          email?: string | null
          active?: boolean | null
          active_since?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          firstname?: string | null
          lastname?: string | null
          birth_date?: string | null
          care_level?: number | null
          pronoun?: string | null
          email?: string | null
          active?: boolean | null
          active_since?: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          start: string | null
          end: string | null
          location: string | null
          patient: string | null
          attachements: string[] | null
          category: string | null
          notes: string | null
          title: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          start?: string | null
          end?: string | null
          location?: string | null
          patient?: string | null
          attachements?: string[] | null
          category?: string | null
          notes?: string | null
          title?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          start?: string | null
          end?: string | null
          location?: string | null
          patient?: string | null
          attachements?: string[] | null
          category?: string | null
          notes?: string | null
          title?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          label: string | null
          description: string | null
          color: string | null
          icon: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          label?: string | null
          description?: string | null
          color?: string | null
          icon?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          label?: string | null
          description?: string | null
          color?: string | null
          icon?: string | null
        }
      }
      activities: {
        Row: {
          id: string
          created_at: string
          created_by: string | null
          appointment: string | null
          type: string | null
          content: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          created_by?: string | null
          appointment?: string | null
          type?: string | null
          content?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          created_by?: string | null
          appointment?: string | null
          type?: string | null
          content?: string | null
        }
      }
    }
  }
}