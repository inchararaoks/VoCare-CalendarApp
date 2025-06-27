# VoCare-CalendarApp



The web application demonstrates key features required for appointment management.

---

## Implemented Features

The application includes:

### Calendar Views
- **Monatsansicht** (Month View)
- **Wochenansicht** (Week View)
- **Terminliste** (Appointment List)

### Appointment Management
- **Filtering Appointments**  
  By `Kategorie` (category), `Zeitraum` (time period), and `Klient:in` (client).
- **Hover Details**  
  Display additional info on hover using `shadcn/ui`'s `HoverCard` in Month and Week views.
- **Appointment Creation**  
  Dialog-based creation and editing as suggested.
- **View / Edit Appointments**  
  Appointments can be opened and edited using modals.

### Localization
- Entire frontend is in **German**.

---

## Tech Stack


- **Frontend**: Next.js, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase

---

## Database Schema Adherence

Included tables:
- `activities`
- `appointment_assignee`
- `appointments`
- `categories`
- `patients`
- `relatives`


### Future Enhancements

Here are suggestions for future improvement:

- **User Management**  
  Introduce a dedicated `users` table with roles (e.g., Pflegekraft, Verwaltung, Admin) for better access control and reliable user references (`created_by`, `appointment_assignee.user`).

- **Audit Logging**  
  Extend the schema with fields like `modified_by`, or integrate a full audit log for better traceability, especially important in healthcare systems.

- **Appointment Conflict Detection**  
  Appointments are not currently validated against staff working hours or overlapping bookings. Introducing a `staff_availability` table and implementing server-side or API-based validation would ensure:
  - Appointments fall within the assigned staff’s available working hours.
  - Staff members are not double-booked for overlapping times.




---

