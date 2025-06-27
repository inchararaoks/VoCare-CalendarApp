'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Patient {
  id: string
  firstname: string | null
  lastname: string | null
  email: string | null
  pronoun: string | null
  active: boolean | null
}

export interface Category {
  id: string
  label: string | null
  description: string | null
  color: string | null
  icon: string | null
}

export interface Appointment {
  id: string
  title: string | null
  start: string | null
  end: string | null
  location: string | null
  notes: string | null
  patient: string | null
  category: string | null
  patient_data?: Patient
  category_data?: Category
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient_data:patients!appointments_patient_fkey(*),
          category_data:categories!appointments_category_fkey(*)
        `)
        .order('start', { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('active', true)
        .order('lastname', { ascending: true })

      if (error) throw error
      setPatients(data || [])
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('label', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const createAppointment = async (appointment: Partial<Appointment>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()

      if (error) throw error
      await fetchAppointments()
      return data[0]
    } catch (error) {
      console.error('Error creating appointment:', error)
      throw error
    }
  }

  const updateAppointment = async (id: string, appointment: Partial<Appointment>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(appointment)
        .eq('id', id)
        .select()

      if (error) throw error
      await fetchAppointments()
      return data[0]
    } catch (error) {
      console.error('Error updating appointment:', error)
      throw error
    }
  }

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchAppointments()
    } catch (error) {
      console.error('Error deleting appointment:', error)
      throw error
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchAppointments(),
        fetchPatients(),
        fetchCategories()
      ])
      setLoading(false)
    }

    loadData()
  }, [])

  return {
    appointments,
    patients,
    categories,
    loading,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    refreshAppointments: fetchAppointments
  }
}