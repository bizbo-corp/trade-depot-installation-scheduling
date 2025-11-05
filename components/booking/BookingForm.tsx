"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, parse, getDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Calendar, Clock, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const bookingFormSchema = z.object({
  date: z.string().min(1, "Please select a date"),
  timeSlot: z.enum(["10:30", "11:00", "11:30"], {
    required_error: "Please select a time slot",
  }),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(1, "Mobile number is required").max(20),
})

export type BookingFormData = z.infer<typeof bookingFormSchema>

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => Promise<void>
  isSubmitting?: boolean
}

export function BookingForm({ onSubmit, isSubmitting = false }: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<"10:30" | "11:00" | "11:30">("11:00")

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      date: "",
      timeSlot: "11:00",
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
    },
  })

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return format(today, "yyyy-MM-dd")
  }

  // Check if a date is a weekday
  const isWeekday = (dateString: string) => {
    try {
      const date = parse(dateString, "yyyy-MM-dd", new Date())
      const day = getDay(date)
      return day >= 1 && day <= 5 // Monday = 1, Friday = 5
    } catch {
      return false
    }
  }

  // Handle date selection
  const handleDateChange = (dateString: string) => {
    setSelectedDate(dateString)
    if (isWeekday(dateString)) {
      form.setValue("date", dateString, { shouldValidate: true })
      form.clearErrors("date")
    } else if (dateString) {
      form.setError("date", {
        type: "manual",
        message: "Please select a weekday (Monday-Friday)",
      })
    }
  }

  // Handle time slot selection
  const handleTimeSlotChange = (slot: "10:30" | "11:00" | "11:30") => {
    setSelectedTimeSlot(slot)
    form.setValue("timeSlot", slot, { shouldValidate: true })
  }

  // Format date for display
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return ""
    try {
      const date = parse(dateString, "yyyy-MM-dd", new Date())
      return format(date, "EEEE, MMMM d, yyyy")
    } catch {
      return dateString
    }
  }

  const handleSubmit = async (data: BookingFormData) => {
    await onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Date Selection */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Select Date
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  min={getMinDate()}
                  value={selectedDate || field.value || ""}
                  onChange={(e) => {
                    handleDateChange(e.target.value)
                    field.onChange(e.target.value)
                  }}
                  onBlur={field.onBlur}
                  className="w-full"
                />
              </FormControl>
              {selectedDate && isWeekday(selectedDate) && (
                <p className="text-sm text-muted-foreground">
                  Selected: {formatDateDisplay(selectedDate)}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Slot Selection */}
        {selectedDate && isWeekday(selectedDate) && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Select Time (NZT)
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(["10:30", "11:00", "11:30"] as const).map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant={selectedTimeSlot === slot ? "default" : "outline"}
                  onClick={() => handleTimeSlotChange(slot)}
                  className={cn(
                    "flex items-center justify-center gap-2",
                    selectedTimeSlot === slot && "ring-2 ring-ring"
                  )}
                >
                  {slot}
                </Button>
              ))}
            </div>
            <FormField
              control={form.control}
              name="timeSlot"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Form Fields */}
        {selectedDate && isWeekday(selectedDate) && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+64 21 123 4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </>
        )}
      </form>
    </Form>
  )
}

