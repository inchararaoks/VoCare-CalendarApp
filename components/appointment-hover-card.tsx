'use client'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, MapPin, User, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Appointment } from '@/hooks/use-appointments'
import { translations } from '@/lib/translations'

interface AppointmentHoverCardProps {
  appointment: Appointment
  children: React.ReactNode
}

export function AppointmentHoverCard({ appointment, children }: AppointmentHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg">{appointment.title}</h4>
            {appointment.category_data && (
              <Badge 
                className="mt-2"
                style={{ 
                  backgroundColor: appointment.category_data.color + '20',
                  color: appointment.category_data.color  ?? '#999999',
                  borderColor: appointment.category_data.color + '40'
                }}
              >
                {appointment.category_data.label}
              </Badge>
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            {appointment.patient_data && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  {appointment.patient_data.firstname} {appointment.patient_data.lastname}
                </span>
              </div>
            )}

            {appointment.start && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(new Date(appointment.start), 'EEEE, dd. MMMM yyyy', { locale: de })}
                </span>
              </div>
            )}

            {appointment.start && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(new Date(appointment.start), 'HH:mm', { locale: de })}
                  {appointment.end && (
                    <> - {format(new Date(appointment.end), 'HH:mm', { locale: de })}</>
                  )}
                </span>
              </div>
            )}

            {appointment.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.location}</span>
              </div>
            )}

            {appointment.notes && (
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  {appointment.notes}
                </span>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}