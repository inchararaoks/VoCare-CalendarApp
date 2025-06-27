'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from 'date-fns'
import { de } from 'date-fns/locale'
import { translations } from '@/lib/translations'
import { Appointment } from '@/hooks/use-appointments'
import { AppointmentHoverCard } from './appointment-hover-card'

interface WeekViewProps {
  appointments: Appointment[]
  onAppointmentClick: (appointment: Appointment) => void
}

export function WeekView({ appointments, onAppointmentClick }: WeekViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday start
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const hours = Array.from({ length: 13 }, (_, i) => i + 7) // 7 AM to 7 PM

  const getAppointmentsForDayAndHour = (day: Date, hour: number) => {
    return appointments.filter(apt => {
      if (!apt.start) return false
      const aptDate = new Date(apt.start)
      return isSameDay(aptDate, day) && aptDate.getHours() === hour
    })
  }

  const weekDays = [
    translations.calendar.monday,
    translations.calendar.tuesday,
    translations.calendar.wednesday,
    translations.calendar.thursday,
    translations.calendar.friday,
    translations.calendar.saturday,
    translations.calendar.sunday
  ]

  const handlePreviousWeek = () => {
    setCurrentDate(prev => subWeeks(prev, 1))
  }

  const handleNextWeek = () => {
    setCurrentDate(prev => addWeeks(prev, 1))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {translations.calendar.weekView}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousWeek}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[250px] text-center">
              {format(weekStart, 'd. MMMM', { locale: de })} - {format(weekEnd, 'd. MMMM yyyy', { locale: de })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextWeek}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 gap-1">
          {/* Time column header */}
          <div className="p-2 text-center text-sm font-medium text-muted-foreground">
            Zeit
          </div>
          
          {/* Day headers */}
          {days.map((day, index) => {
            const isToday = isSameDay(day, new Date())
            return (
              <div key={day.toISOString()} className="p-2 text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  {weekDays[index]}
                </div>
                <div className={`text-lg font-semibold ${
                  isToday ? 'text-primary' : 'text-foreground'
                }`}>
                  {format(day, 'd. MMM', { locale: de })}
                </div>
              </div>
            )
          })}
          
          {/* Time slots */}
          {hours.map((hour) => (
            <>
              {/* Time label */}
              <div key={`time-${hour}`} className="p-2 text-sm text-muted-foreground text-right">
                {hour}:00
              </div>
              
              {/* Day slots */}
              {days.map((day) => {
                const hourAppointments = getAppointmentsForDayAndHour(day, hour)
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="min-h-[60px] p-1 border border-border hover:bg-muted/50 transition-colors"
                  >
                    {hourAppointments.map((appointment) => (
                      <AppointmentHoverCard key={appointment.id} appointment={appointment}>
                        <div
                          className="text-xs p-2 rounded cursor-pointer hover:opacity-80 transition-opacity h-full"
                          style={{
                            backgroundColor: appointment.category_data?.color || '#3b82f6',
                            color: 'white'
                          }}
                          onClick={() => onAppointmentClick(appointment)}
                        >
                          <div className="font-medium truncate">{appointment.title}</div>
                          <div className="opacity-90 truncate">
                            {appointment.patient_data?.firstname} {appointment.patient_data?.lastname}
                          </div>
                        </div>
                      </AppointmentHoverCard>
                    ))}
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}