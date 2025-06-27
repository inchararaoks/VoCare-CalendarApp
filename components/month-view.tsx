'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns'
import { de } from 'date-fns/locale'
import { translations } from '@/lib/translations'
import { Appointment } from '@/hooks/use-appointments'
import { AppointmentHoverCard } from './appointment-hover-card'

interface MonthViewProps {
  appointments: Appointment[]
  onAppointmentClick: (appointment: Appointment) => void
}

export function MonthView({ appointments, onAppointmentClick }: MonthViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(apt => 
      apt.start && isSameDay(new Date(apt.start), day)
    )
  }

  const weekDays = [
    translations.calendar.sun,
    translations.calendar.mon,
    translations.calendar.tue,
    translations.calendar.wed,
    translations.calendar.thu,
    translations.calendar.fri,
    translations.calendar.sat
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {translations.calendar.monthView}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[140px] text-center">
              {format(currentDate, 'MMMM yyyy', { locale: de })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="h-24 p-1"></div>
          ))}
          
          {days.map((day) => {
            const dayAppointments = getAppointmentsForDay(day)
            const isToday = isSameDay(day, new Date())
            
            return (
              <div
                key={day.toISOString()}
                className={`h-24 p-1 border rounded-lg hover:bg-muted/50 transition-colors ${
                  isToday ? 'bg-primary/10 border-primary' : 'border-border'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-primary' : 'text-foreground'
                }`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((appointment) => (
                    <AppointmentHoverCard key={appointment.id} appointment={appointment}>
                      <div
                        className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity truncate"
                        style={{
                          backgroundColor: appointment.category_data?.color || '#3b82f6',
                          color: 'white'
                        }}
                        onClick={() => onAppointmentClick(appointment)}
                      >
                        {appointment.start && format(new Date(appointment.start), 'HH:mm')} {appointment.title}
                      </div>
                    </AppointmentHoverCard>
                  ))}
                  
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-muted-foreground p-1">
                      +{dayAppointments.length - 2} weitere
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}