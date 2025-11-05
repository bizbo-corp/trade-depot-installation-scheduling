"use client"

import { format, parse } from "date-fns"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Calendar, Clock, Download } from "lucide-react"
import { generateICSFile, downloadICSFile } from "@/lib/calendar-ics"

interface BookingSuccessProps {
  date: string
  timeSlot: "10:30" | "11:00" | "11:30"
  firstName: string
  lastName: string
  email: string
  mobile?: string
  onClose: () => void
  onBookAnother?: () => void
}

export function BookingSuccess({
  date,
  timeSlot,
  firstName,
  lastName,
  email,
  mobile,
  onClose,
  onBookAnother,
}: BookingSuccessProps) {
  const formatDateDisplay = (dateString: string) => {
    try {
      const date = parse(dateString, "yyyy-MM-dd", new Date())
      return format(date, "EEEE, MMMM d, yyyy")
    } catch {
      return dateString
    }
  }

  const formatTime = (slot: string) => {
    return `${slot} NZT`
  }

  const handleAddToCalendar = () => {
    try {
      const icsContent = generateICSFile({
        date,
        timeSlot,
        firstName,
        lastName,
        email,
        mobile,
      })
      
      const filename = `discovery-call-${date}-${timeSlot.replace(":", "")}.ics`
      downloadICSFile(icsContent, filename)
    } catch (error) {
      console.error("Error generating calendar file:", error)
    }
  }

  return (
    <div className="flex flex-col items-center text-center space-y-6 py-4 h-full">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-olive-200 dark:bg-olive-900/80">
        <CheckCircle2 className="h-8 w-8 text-olive-600 dark:text-olive-400" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-semibold">Booking Confirmed!</h3>
        <p className="text-muted-foreground">
          Your discovery call has been scheduled successfully.
        </p>
      </div>

      <div className="w-full space-y-3 rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3 text-left">
          <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">{formatDateDisplay(date)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-left">
          <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="font-medium">{formatTime(timeSlot)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <p className="text-sm text-muted-foreground">
          We look forward to speaking with you, {firstName}! Click the button below to add this appointment to your calendar.
        </p>
      </div>

      <Button
        onClick={handleAddToCalendar}
        className="w-full mt-auto"
        size="lg"
      >
        <Download className="mr-2 h-5 w-5" />
        Download Calendar Invite
      </Button>
    </div>
  )
}

