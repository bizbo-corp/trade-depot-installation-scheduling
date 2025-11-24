"use client";

import { FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

type BookingSuccessProps = {
  onClose?: () => void;
};

export function BookingSuccess({ onClose }: BookingSuccessProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <FaCheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Thank you for scheduling your installation. You should receive a
          confirmation email shortly.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check your email for booking confirmation</li>
            <li>• Ensure someone is present at the scheduled time</li>
            <li>• Have your items ready for installation</li>
            <li>• Contact us if you need to reschedule</li>
          </ul>
        </div>
      </div>
      {onClose && (
        <Button onClick={onClose} size="lg" className="w-full max-w-md">
          Close
        </Button>
      )}
    </div>
  );
}
