"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookingForm, type BookingFormData } from "./BookingForm"
import { BookingSuccess } from "./BookingSuccess"
import { toast } from "sonner"

interface BookingDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function BookingDialog({ children, open, onOpenChange }: BookingDialogProps) {
  const [isOpen, setIsOpen] = useState(open ?? false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const handleSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/calendar/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        // Show detailed error in development
        const errorMessage = result.details 
          ? `${result.message || result.error}\n\nDetails: ${result.details}`
          : result.message || result.error || "Failed to book appointment"
        throw new Error(errorMessage)
      }

      // Success
      setBookingData(data)
      setShowSuccess(true)
      toast.success("Booking confirmed!", {
        description: "Your discovery call has been scheduled.",
      })
    } catch (error) {
      console.error("Booking error:", error)
      toast.error("Booking failed", {
        description:
          error instanceof Error
            ? error.message
            : "Unable to book appointment. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setShowSuccess(false)
    setBookingData(null)
    onOpenChange?.(false)
  }

  const handleBookAnother = () => {
    setShowSuccess(false)
    setBookingData(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
          {!showSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle>Schedule a Discovery Call</DialogTitle>
                <DialogDescription>
                  Book a free discovery session to discuss your project. Select a date and time
                  slot below. All times are in New Zealand Time (NZT).
                </DialogDescription>
              </DialogHeader>
              <BookingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </>
          ) : bookingData ? (
            <BookingSuccess
              date={bookingData.date}
              timeSlot={bookingData.timeSlot}
              firstName={bookingData.firstName}
              lastName={bookingData.lastName}
              onClose={handleClose}
              onBookAnother={handleBookAnother}
            />
          ) : null}
        </DialogContent>
      </Dialog>
  )
}

