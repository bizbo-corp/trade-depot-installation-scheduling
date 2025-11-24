"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export function BookingDetailsForm({
  orderId: defaultOrderId,
  initialData,
}: BookingDetailsFormProps) {
  const router = useRouter();
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    orderId: defaultOrderId || initialData?.orderId || "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
  });

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
            disabled={!!defaultOrderId}
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
        <div className="flex gap-3 pt-4">
          <Button type="submit" className="w-full">
            Continue to Booking
            <FaCalendarAlt className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
