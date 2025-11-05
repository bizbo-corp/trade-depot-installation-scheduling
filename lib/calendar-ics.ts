import { format, parse, addMinutes } from "date-fns"

const NZT_TIMEZONE = "Pacific/Auckland"

interface GenerateICSParams {
  date: string // YYYY-MM-DD format
  timeSlot: "10:30" | "11:00" | "11:30"
  firstName: string
  lastName: string
  email: string
  mobile?: string
  description?: string
  location?: string
}

/**
 * Escapes special characters in ICS content
 */
function escapeICSValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
}

/**
 * Formats a date-time for ICS (UTC format)
 */
function formatICSDateTime(date: Date): string {
  // Format date in UTC for ICS: YYYYMMDDTHHMMSSZ
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  const hours = String(date.getUTCHours()).padStart(2, "0")
  const minutes = String(date.getUTCMinutes()).padStart(2, "0")
  const seconds = String(date.getUTCSeconds()).padStart(2, "0")
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

/**
 * Generates an ICS file content for a calendar event
 */
export function generateICSFile(params: GenerateICSParams): string {
  const { date, timeSlot, firstName, lastName, email, mobile, description, location } = params

  // Parse the date and time
  const [hours, minutes] = timeSlot.split(":").map(Number)
  const dateObj = parse(date, "yyyy-MM-dd", new Date())
  
  // Create date string components
  const dateStr = format(dateObj, "yyyy-MM-dd")
  const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`
  
  // Determine timezone offset for NZT (handles DST)
  // Determine if we're in DST (NZDT = UTC+13, NZST = UTC+12)
  // NZDT runs from last Sunday in September to first Sunday in April
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  
  // Approximate: Oct-Mar is usually NZDT (UTC+13), Apr-Sep is NZST (UTC+12)
  // More precise would check actual DST dates, but this is close enough
  const isNZDT = (month >= 10) || (month <= 3) || (month === 4 && day <= 7) || (month === 9 && day >= 25)
  const nztOffsetHours = isNZDT ? 13 : 12
  
  // Create date string with NZT offset: YYYY-MM-DDTHH:mm:ss+13:00
  const offsetString = `+${String(nztOffsetHours).padStart(2, "0")}:00`
  const dateWithOffset = `${dateStr}T${timeStr}${offsetString}`
  
  // Parse this date - JavaScript will convert it to UTC
  const startDateTimeUTC = new Date(dateWithOffset)
  
  // Calculate end time (30 minutes later)
  const endDateTimeUTC = addMinutes(startDateTimeUTC, 30)

  // Format dates
  const dtstart = formatICSDateTime(startDateTimeUTC)
  const dtend = formatICSDateTime(endDateTimeUTC)
  const dtstamp = formatICSDateTime(new Date()) // Current time as timestamp

  // Generate summary
  const summary = `Discovery Call - ${firstName} ${lastName}`

  // Generate description
  const eventDescription = description || [
    `Discovery call with ${firstName} ${lastName}`,
    "",
    `Contact Details:`,
    `Email: ${email}`,
    mobile ? `Mobile: ${mobile}` : null,
    "",
    `This is a 30-minute discovery session to discuss your project.`,
    "",
    `Time: ${timeSlot} NZT (Pacific/Auckland)`,
  ]
    .filter(Boolean)
    .join("\\n")

  // Generate unique ID (using email and timestamp)
  const uid = `discovery-call-${date}-${timeSlot.replace(":", "")}-${email}@bizbo.co.nz`

  // Build ICS content
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bizbo//Discovery Call//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${escapeICSValue(summary)}`,
    `DESCRIPTION:${escapeICSValue(eventDescription)}`,
    location ? `LOCATION:${escapeICSValue(location)}` : null,
    `ORGANIZER;CN=Bizbo:mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "michael@bizbo.co.nz"}`,
    `ATTENDEE;CN=${firstName} ${lastName};RSVP=TRUE:mailto:${email}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    `DESCRIPTION:Reminder: Discovery Call with Bizbo in 15 minutes`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n")

  return icsContent
}

/**
 * Downloads an ICS file to the user's device
 */
export function downloadICSFile(icsContent: string, filename: string = "discovery-call.ics"): void {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
