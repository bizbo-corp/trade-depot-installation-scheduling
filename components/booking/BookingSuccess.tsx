"use client"

import { format, parse } from "date-fns"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Calendar, Clock } from "lucide-react"

interface BookingSuccessProps {
  date: string
  timeSlot: "10:30" | "11:00" | "11:30"
  firstName: string
  lastName: string
  onClose: () => void
  onBookAnother?: () => void
}

export function BookingSuccess({
  date,
  timeSlot,
  firstName,
  lastName,
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

  return (
    <div className="flex flex-col items-center text-center space-y-6 py-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20">
        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
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
          A calendar invitation has been sent to your email address. We look forward to
          speaking with you, {firstName}!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {onBookAnother && (
          <Button variant="outline" onClick={onBookAnother} className="flex-1">
            Book Another
          </Button>
        )}
        <Button onClick={onClose} className="flex-1">
          Close
        </Button>
      </div>
    </div>
  )
}

