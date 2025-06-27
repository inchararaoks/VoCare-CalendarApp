'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Filter, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { translations } from '@/lib/translations'
import { Appointment, Patient, Category } from '@/hooks/use-appointments'

interface DashboardStatsProps {
  appointments: Appointment[]
  patients: Patient[]
  categories: Category[]
}

export function DashboardStats({ appointments, patients, categories }: DashboardStatsProps) {
  const [selectedStat, setSelectedStat] = useState<string | null>(null)
  
  const today = new Date().toISOString().split('T')[0]
  const todaysAppointments = appointments.filter(apt => 
    apt.start?.startsWith(today)
  )

  const stats = [
    {
      id: 'appointments',
      title: translations.dashboard.totalAppointments,
      value: appointments.length,
      icon: Calendar,
      color: 'text-blue-600',
      data: appointments
    },
    {
      id: 'patients',
      title: translations.dashboard.activePatients,
      value: patients.length,
      icon: Users,
      color: 'text-green-600',
      data: patients
    },
    {
      id: 'categories',
      title: translations.dashboard.categories,
      value: categories.length,
      icon: Filter,
      color: 'text-purple-600',
      data: categories
    },
    {
      id: 'today',
      title: translations.dashboard.todaysAppointments,
      value: todaysAppointments.length,
      icon: Clock,
      color: 'text-orange-600',
      data: todaysAppointments
    }
  ]

  const renderDialogContent = () => {
    const stat = stats.find(s => s.id === selectedStat)
    if (!stat) return null

    switch (selectedStat) {
      case 'appointments':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Alle Termine ({stat.value})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(stat.data as Appointment[]).map((appointment) => (
                <div key={appointment.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{appointment.title}</h4>
                      {appointment.patient_data && (
                        <p className="text-sm text-muted-foreground">
                          {appointment.patient_data.firstname} {appointment.patient_data.lastname}
                        </p>
                      )}
                      {appointment.start && (
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(appointment.start), 'dd.MM.yyyy HH:mm', { locale: de })}
                        </p>
                      )}
                    </div>
                    {appointment.category_data && (
                      <Badge 
                        style={{ 
                          backgroundColor: appointment.category_data.color + '20',
                          color: appointment.category_data.color ?? '#999999',
                          borderColor: appointment.category_data.color + '40'
                        }}
                      >
                        {appointment.category_data.label}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'patients':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Aktive Patienten ({stat.value})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(stat.data as Patient[]).map((patient) => (
                <div key={patient.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{patient.firstname} {patient.lastname}</h4>
                  {patient.email && (
                    <p className="text-sm text-muted-foreground">{patient.email}</p>
                  )}
                  {patient.pronoun && (
                    <p className="text-sm text-muted-foreground">Pronomen: {patient.pronoun}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'categories':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Kategorien ({stat.value})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(stat.data as Category[]).map((category) => (
                <div key={category.id} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color || '#94a3b8' }}
                    />
                    <div>
                      <h4 className="font-medium">{category.label}</h4>
                      {category.description && (
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'today':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Heutige Termine ({stat.value})</h3>
            {stat.value === 0 ? (
              <p className="text-muted-foreground">Keine Termine für heute</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {(stat.data as Appointment[]).map((appointment) => (
                  <div key={appointment.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{appointment.title}</h4>
                        {appointment.patient_data && (
                          <p className="text-sm text-muted-foreground">
                            {appointment.patient_data.firstname} {appointment.patient_data.lastname}
                          </p>
                        )}
                        {appointment.start && (
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(appointment.start), 'HH:mm', { locale: de })}
                            {appointment.end && (
                              <> - {format(new Date(appointment.end), 'HH:mm', { locale: de })}</>
                            )}
                          </p>
                        )}
                      </div>
                      {appointment.category_data && (
                        <Badge 
                          style={{ 
                            backgroundColor: appointment.category_data.color + '20',
                            color: appointment.category_data.color ?? '#999999',
                            borderColor: appointment.category_data.color + '40'
                          }}
                        >
                          {appointment.category_data.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card 
            key={stat.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedStat(stat.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {translations.dashboard.clickToViewDetails}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedStat} onOpenChange={() => setSelectedStat(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Details
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto">
            {renderDialogContent()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}