'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, List as ListIcon, Rows3 } from 'lucide-react'
import { translations } from '@/lib/translations'
import { useAppointments } from '@/hooks/use-appointments'
import { DashboardStats } from '@/components/dashboard-stats'
import { AppointmentFilters, type FilterState } from '@/components/appointment-filters'
import { MonthView } from '@/components/month-view'
import { WeekView } from '@/components/week-view'
import { ListView } from '@/components/list-view'
import { AppointmentDialog } from '@/components/appointment-dialog'
import { type Appointment } from '@/hooks/use-appointments'

type ViewType = 'month' | 'week' | 'list'

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('month')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    patient: 'all',
    fromDate: null,
    toDate: null
  })

  const { 
    appointments, 
    patients, 
    categories, 
    loading, 
    createAppointment,
    updateAppointment,
    deleteAppointment
  } = useAppointments()

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // Category filter
      if (filters.category !== 'all' && apt.category !== filters.category) {
        return false
      }

      // Patient filter
      if (filters.patient !== 'all' && apt.patient !== filters.patient) {
        return false
      }

      // Date range filter
      if (filters.fromDate && apt.start) {
        const aptDate = new Date(apt.start)
        if (aptDate < filters.fromDate) {
          return false
        }
      }

      if (filters.toDate && apt.start) {
        const aptDate = new Date(apt.start)
        if (aptDate > filters.toDate) {
          return false
        }
      }

      return true
    })
  }, [appointments, filters])

  const handleCreateAppointment = () => {
    setEditingAppointment(null)
    setDialogOpen(true)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setDialogOpen(true)
  }

  const handleSaveAppointment = async (appointmentData: Partial<Appointment>) => {
    try {
      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, appointmentData)
      } else {
        await createAppointment(appointmentData)
      }
      setDialogOpen(false)
      setEditingAppointment(null)
    } catch (error) {
      console.error('Error saving appointment:', error)
      throw error
    }
  }

  const handleDeleteAppointment = async (id: string) => {
    if (confirm('Möchten Sie diesen Termin wirklich löschen?')) {
      await deleteAppointment(id)
    }
  }

  const viewButtons = [
    { key: 'month', label: translations.views.month, icon: Calendar },
    { key: 'week', label: translations.views.week, icon: Rows3 },
    { key: 'list', label: translations.views.list, icon: ListIcon }
  ] as const

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-12 w-12 animate-pulse text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">{translations.common.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <Calendar className="h-10 w-10 text-blue-600" />
              {translations.header.title}
            </h1>
            <p className="text-lg text-slate-600 mt-1">
              {translations.header.subtitle}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex rounded-lg border bg-white shadow-sm">
              {viewButtons.map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={currentView === key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView(key as ViewType)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
            
            <Button onClick={handleCreateAppointment} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {translations.header.newAppointment}
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats 
          appointments={filteredAppointments}
          patients={patients}
          categories={categories}
        />

        {/* Filters */}
        <AppointmentFilters
          patients={patients}
          categories={categories}
          onFilterChange={setFilters}
        />

        {/* Main Content */}
        <div className="space-y-6">
          {currentView === 'month' && (
            <MonthView 
              appointments={filteredAppointments}
              onAppointmentClick={handleEditAppointment}
            />
          )}
          
          {currentView === 'week' && (
            <WeekView 
              appointments={filteredAppointments}
              onAppointmentClick={handleEditAppointment}
            />
          )}
          
          {currentView === 'list' && (
            <ListView 
              appointments={filteredAppointments}
              onEditAppointment={handleEditAppointment}
              onDeleteAppointment={handleDeleteAppointment}
            />
          )}
        </div>

        {/* Appointment Dialog */}
        <AppointmentDialog
          isOpen={dialogOpen}
          onClose={() => {
            setDialogOpen(false)
            setEditingAppointment(null)
          }}
          appointment={editingAppointment}
          patients={patients}
          categories={categories}
          onSave={handleSaveAppointment}
        />
      </div>
    </div>
  )
}