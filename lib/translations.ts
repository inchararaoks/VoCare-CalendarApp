export const translations = {
  header: {
    title: "Vocare Kalender",
    subtitle: "Professionelle Terminverwaltung",
    newAppointment: "Neuer Termin"
  },
  views: {
    month: "Monat",
    week: "Woche",
    list: "Liste"
  },
  dashboard: {
    totalAppointments: "Termine gesamt",
    activePatients: "Aktive Patienten",
    categories: "Kategorien",
    todaysAppointments: "Heutige Termine",
    clickToViewDetails: "Klicken Sie, um Details anzuzeigen"
  },
  filters: {
    title: "Filter",
    category: "Kategorie",
    patient: "Patient",
    dateRange: "Zeitraum",
    allCategories: "Alle Kategorien",
    allPatients: "Alle Patienten",
    fromDate: "Von Datum",
    toDate: "Bis Datum"
  },
  calendar: {
    monthView: "Monatsansicht",
    weekView: "Wochenansicht",
    sun: "So",
    mon: "Mo",
    tue: "Di",
    wed: "Mi",
    thu: "Do",
    fri: "Fr",
    sat: "Sa",
    sunday: "Sonntag",
    monday: "Montag",
    tuesday: "Dienstag",
    wednesday: "Mittwoch",
    thursday: "Donnerstag",
    friday: "Freitag",
    saturday: "Samstag"
  },
  appointments: {
    title: "Termin",
    patient: "Patient",
    category: "Kategorie",
    location: "Ort",
    time: "Zeit",
    notes: "Notizen",
    actions: "Aktionen",
    edit: "Bearbeiten",
    delete: "Löschen",
    noAppointments: "Keine Termine gefunden"
  },
  forms: {
    createAppointment: "Neuen Termin erstellen",
    editAppointment: "Termin bearbeiten",
    appointmentTitle: "Termintitel",
    titlePlaceholder: "z.B. Routineuntersuchung, Beratungsgespräch",
    startDate: "Startdatum",
    startTime: "Startzeit",
    endDate: "Enddatum (Optional)",
    endTime: "Endzeit",
    pickDate: "Datum wählen",
    sameDay: "Gleicher Tag",
    selectPatient: "Patient auswählen",
    selectCategory: "Kategorie auswählen",
    locationPlaceholder: "z.B. Raum 101, Hauptgebäude",
    notesPlaceholder: "Zusätzliche Notizen zum Termin...",
    cancel: "Abbrechen",
    create: "Termin erstellen",
    update: "Termin aktualisieren",
    fillDetails: "Füllen Sie die Details aus, um einen neuen Termin zu erstellen.",
    modifyDetails: "Ändern Sie die Details Ihres Termins.",
    patient: "Patient",
    category:'Kategorie'
  },
  months: {
    january: "Januar",
    february: "Februar",
    march: "März",
    april: "April",
    may: "Mai",
    june: "Juni",
    july: "Juli",
    august: "August",
    september: "September",
    october: "Oktober",
    november: "November",
    december: "Dezember"
  },
  common: {
    loading: "Laden...",
    error: "Ein Fehler ist aufgetreten",
    success: "Erfolgreich",
    confirm: "Bestätigen",
    close: "Schließen"
  }
}

export type TranslationKey = keyof typeof translations