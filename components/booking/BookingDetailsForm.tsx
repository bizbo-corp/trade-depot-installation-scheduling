"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaIcon } from "@/components/ui/fa-icon";

type CustomerDetails = {
  orderId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type BookingDetailsFormProps = {
  orderId?: string;
  initialData?: Partial<CustomerDetails>;
};

const STORAGE_KEY = "booking-form-state";

function loadFormStateFromStorage(): Partial<CustomerDetails> | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveFormStateToStorage(details: CustomerDetails) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
  } catch {
    // Ignore storage errors
  }
}

export function clearBookingFormState() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function BookingDetailsForm({
  orderId: defaultOrderId,
  initialData,
}: BookingDetailsFormProps) {
  const router = useRouter();
  
  // Load from localStorage or use initial data
  const storedState = loadFormStateFromStorage();
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>(() => {
    // Priority: URL params (initialData) > localStorage > defaults
    return {
      orderId: defaultOrderId || initialData?.orderId || storedState?.orderId || "",
      firstName: initialData?.firstName || storedState?.firstName || "",
      lastName: initialData?.lastName || storedState?.lastName || "",
      email: initialData?.email || storedState?.email || "",
      phone: initialData?.phone || storedState?.phone || "",
    };
  });

  // Save to localStorage whenever form data changes
  useEffect(() => {
    saveFormStateToStorage(customerDetails);
  }, [customerDetails]);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !customerDetails.orderId ||
      !customerDetails.firstName ||
      !customerDetails.lastName ||
      !customerDetails.email ||
      !customerDetails.phone
    ) {
      alert("Please fill in all fields");
      return;
    }

    const params = new URLSearchParams();
    params.set("orderId", customerDetails.orderId);
    params.set("firstName", customerDetails.firstName);
    params.set("lastName", customerDetails.lastName);
    params.set("email", customerDetails.email);
    params.set("phone", customerDetails.phone);

    router.push(`/installation-scheduler?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Details</h2>
        <p className="text-gray-600">Please provide your contact information</p>
      </div>
      <form onSubmit={handleDetailsSubmit} className="space-y-4">
        <div>
          <Label htmlFor="orderId">Order ID *</Label>
          <Input
            id="orderId"
            type="text"
            required
            value={customerDetails.orderId}
            onChange={(e) =>
              setCustomerDetails({
                ...customerDetails,
                orderId: e.target.value,
              })
            }
            className="mt-1"
            placeholder="e.g., 12345"
          />
          {defaultOrderId && (
            <p className="text-sm text-gray-500 mt-1">
              Order ID provided via link
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              type="text"
              required
              value={customerDetails.firstName}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  firstName: e.target.value,
                })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              type="text"
              required
              value={customerDetails.lastName}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  lastName: e.target.value,
                })
              }
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            value={customerDetails.email}
            onChange={(e) =>
              setCustomerDetails({
                ...customerDetails,
                email: e.target.value,
              })
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={customerDetails.phone}
            onChange={(e) =>
              setCustomerDetails({
                ...customerDetails,
                phone: e.target.value,
              })
            }
            className="mt-1"
          />
        </div>
        <div className="flex gap-3 pt-4 justify-end">
          <Button type="submit" className="">
            Continue to Booking
            <FaIcon icon="calendar" className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
