'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Clock, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { translations } from '@/lib/translations'
import { Appointment, Patient, Category } from '@/hooks/use-appointments'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AppointmentDialogProps {
  isOpen: boolean
  onClose: () => void
  appointment?: Appointment | null
  patients: Patient[]
  categories: Category[]
  onSave: (appointment: Partial<Appointment>) => Promise<void>
}

export function AppointmentDialog({ 
  isOpen, 
  onClose, 
  appointment, 
  patients, 
  categories, 
  onSave 
}: AppointmentDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    patient: '',
    category: '',
    location: '',
    notes: '',
    startDate: undefined as Date | undefined,
    startTime: '',
    endDate: undefined as Date | undefined,
    endTime: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (appointment) {
      const startDate = appointment.start ? new Date(appointment.start) : undefined
      const endDate = appointment.end ? new Date(appointment.end) : undefined
      
      setFormData({
        title: appointment.title || '',
        patient: appointment.patient || '',
        category: appointment.category || '',
        location: appointment.location || '',
        notes: appointment.notes || '',
        startDate: startDate,
        startTime: startDate ? format(startDate, 'HH:mm') : '',
        endDate: endDate,
        endTime: endDate ? format(endDate, 'HH:mm') : ''
      })
    } else {
      setFormData({
        title: '',
        patient: '',
        category: '',
        location: '',
        notes: '',
        startDate: undefined,
        startTime: '',
        endDate: undefined,
        endTime: ''
      })
    }
    setError('')
  }, [appointment, isOpen])

  const validateForm = () => {
    // Check required fields
    if (!formData.title.trim()) {
      setError('Termintitel ist erforderlich')
      return false
    }

    if (!formData.startDate) {
      setError('Startdatum ist erforderlich')
      return false
    }

    if (!formData.startTime) {
      setError('Startzeit ist erforderlich')
      return false
    }

    if (!formData.endTime) {
      setError('Endzeit ist erforderlich')
      return false
    }

    // Use start date as end date if end date is not specified
    const endDateToUse = formData.endDate || formData.startDate

    try {
      const startDateTime = new Date(`${format(formData.startDate, 'yyyy-MM-dd')}T${formData.startTime}:00`)
      const endDateTime = new Date(`${format(endDateToUse, 'yyyy-MM-dd')}T${formData.endTime}:00`)
      
      if (isNaN(startDateTime.getTime())) {
        setError('Ungültiges Startdatum oder -zeit')
        return false
      }

      if (isNaN(endDateTime.getTime())) {
        setError('Ungültiges Enddatum oder -zeit')
        return false
      }

      if (endDateTime <= startDateTime) {
        setError('Endzeit muss nach der Startzeit liegen')
        return false
      }
    } catch (error) {
      setError('Ungültige Datum- oder Zeitangaben')
      return false
    }

    setError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Use start date as end date if end date is not specified
      const endDateToUse = formData.endDate || formData.startDate

      const startDateTime = new Date(`${format(formData.startDate!, 'yyyy-MM-dd')}T${formData.startTime}:00`)
      const endDateTime = new Date(`${format(formData.startDate!, 'yyyy-MM-dd')}T${formData.endTime}:00`)


      const appointmentData: Partial<Appointment> = {
        title: formData.title.trim(),
        patient: formData.patient || null,
        category: formData.category || null,
        location: formData.location.trim() || null,
        notes: formData.notes.trim() || null,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString()
      }

      await onSave(appointmentData)
      onClose()
    } catch (error) {
      console.error('Error saving appointment:', error)
      setError('Fehler beim Speichern des Termins. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  const isEditing = !!appointment

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? translations.forms.editAppointment : translations.forms.createAppointment}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isEditing ? translations.forms.modifyDetails : translations.forms.fillDetails}
          </p>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">{translations.forms.appointmentTitle} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={translations.forms.titlePlaceholder}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{translations.forms.startDate} *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "PPP", { locale: de })
                    ) : (
                      <span>{translations.forms.pickDate}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData({ ...formData, startDate: date })}
                    initialFocus
                    locale={de}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">{translations.forms.startTime} *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{translations.forms.endDate}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(formData.endDate, "PPP", { locale: de })
                    ) : (
                      <span>{translations.forms.sameDay}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData({ ...formData, endDate: date })}
                    initialFocus
                    locale={de}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">{translations.forms.endTime} *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{translations.forms.patient}</Label>
              <Select value={formData.patient} onValueChange={(value) => setFormData({ ...formData, patient: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={translations.forms.selectPatient} />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstname} {patient.lastname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{translations.forms.category}</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={translations.forms.selectCategory} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color || '#94a3b8' }}
                        />
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{translations.appointments.location}</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder={translations.forms.locationPlaceholder}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{translations.appointments.notes}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={translations.forms.notesPlaceholder}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {translations.forms.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? translations.common.loading : (
                isEditing ? translations.forms.update : translations.forms.create
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
