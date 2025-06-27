'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Filter } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { translations } from '@/lib/translations'
import { Patient, Category } from '@/hooks/use-appointments'

interface AppointmentFiltersProps {
  patients: Patient[]
  categories: Category[]
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  category: string
  patient: string
  fromDate: Date | null
  toDate: Date | null
}

export function AppointmentFilters({ patients, categories, onFilterChange }: AppointmentFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    patient: 'all',
    fromDate: null,
    toDate: null
  })

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          {translations.filters.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{translations.filters.category}</label>
            <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder={translations.filters.allCategories} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translations.filters.allCategories}</SelectItem>
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

          <div className="space-y-2">
            <label className="text-sm font-medium">{translations.filters.patient}</label>
            <Select value={filters.patient} onValueChange={(value) => updateFilter('patient', value)}>
              <SelectTrigger>
                <SelectValue placeholder={translations.filters.allPatients} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translations.filters.allPatients}</SelectItem>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.firstname} {patient.lastname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{translations.filters.fromDate}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.fromDate ? (
                    format(filters.fromDate, "PPP", { locale: de })
                  ) : (
                    <span>{translations.filters.fromDate}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.fromDate || undefined}
                  onSelect={(date) => updateFilter('fromDate', date || null)}
                  initialFocus
                  locale={de}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{translations.filters.toDate}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.toDate ? (
                    format(filters.toDate, "PPP", { locale: de })
                  ) : (
                    <span>{translations.filters.toDate}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.toDate || undefined}
                  onSelect={(date) => updateFilter('toDate', date || null)}
                  initialFocus
                  locale={de}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}