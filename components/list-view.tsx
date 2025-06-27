'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Trash2, List, MapPin, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { translations } from '@/lib/translations'
import { Appointment } from '@/hooks/use-appointments'

interface ListViewProps {
  appointments: Appointment[]
  onEditAppointment: (appointment: Appointment) => void
  onDeleteAppointment: (id: string) => void
}

export function ListView({ appointments, onEditAppointment, onDeleteAppointment }: ListViewProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <List className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            {translations.appointments.noAppointments}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Terminliste
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{translations.appointments.title}</TableHead>
                <TableHead>{translations.appointments.patient}</TableHead>
                <TableHead>{translations.appointments.category}</TableHead>
                <TableHead>{translations.appointments.time}</TableHead>
                <TableHead>{translations.appointments.location}</TableHead>
                <TableHead>{translations.appointments.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {appointment.title}
                    {appointment.notes && (
                      <p className="text-sm text-muted-foreground mt-1 truncate max-w-xs">
                        {appointment.notes}
                      </p>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {appointment.patient_data ? (
                      <div>
                        <p className="font-medium">
                          {appointment.patient_data.firstname} {appointment.patient_data.lastname}
                        </p>
                        {appointment.patient_data.email && (
                          <p className="text-sm text-muted-foreground">
                            {appointment.patient_data.email}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {appointment.category_data ? (
                      <Badge 
                        variant="secondary"
                        style={{ 
                          backgroundColor: appointment.category_data.color + '20',
                          color: appointment.category_data.color ?? '#999999',
                          borderColor: appointment.category_data.color + '40'
                        }}
                      >
                        {appointment.category_data.label}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {appointment.start ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {format(new Date(appointment.start), 'dd.MM.yyyy', { locale: de })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(appointment.start), 'HH:mm', { locale: de })}
                            {appointment.end && (
                              <> - {format(new Date(appointment.end), 'HH:mm', { locale: de })}</>
                            )}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {appointment.location ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate max-w-xs">{appointment.location}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditAppointment(appointment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteAppointment(appointment.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}