"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, getDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const bookingFormSchema = z.object({
  date: z.string().min(1, "Please select a date"),
  timeSlot: z.enum(["10:30", "11:00", "11:30"]),
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<"10:30" | "11:00" | "11:30">("11:00")
  const [datePickerOpen, setDatePickerOpen] = useState(false)

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

  // Check if a date is a weekday
  const isWeekday = (date: Date) => {
      const day = getDay(date)
      return day >= 1 && day <= 5 // Monday = 1, Friday = 5
  }

  // Disable weekends and past dates
  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    // Disable past dates
    if (checkDate < today) {
      return true
    }
    
    // Disable weekends
    return !isWeekday(date)
  }

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined)
      form.setValue("date", "")
      setDatePickerOpen(false)
      return
    }

    if (isWeekday(date)) {
      setSelectedDate(date)
      const dateString = format(date, "yyyy-MM-dd")
      form.setValue("date", dateString, { shouldValidate: true })
      form.clearErrors("date")
      setDatePickerOpen(false)
    } else {
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
              <FormControl>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!selectedDate}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto min-w-[320px] p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={isDateDisabled}
                      initialFocus
                      className="[--cell-size:3rem]"
                      classNames={{
                        root: "min-w-[280px]",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
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

