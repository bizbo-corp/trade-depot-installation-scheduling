"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/sections/Footer";

import { BookingScheduler } from "@/components/booking/BookingScheduler";
import { BookingSuccess } from "@/components/booking/BookingSuccess";

function SchedulerPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const orderId = searchParams.get("orderId") || "666";
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";

  const customerDetails = { orderId, firstName, lastName, email, phone };

  if (isSuccess) {
    return <BookingSuccess onClose={() => router.push("/")} />;
  }

  return (
    <BookingScheduler
      customerDetails={customerDetails}
      onSuccess={() => setIsSuccess(true)}
      onBack={() => router.back()}
    />
  );
}

export default function InstallationSchedulerPage() {
  return (
    <div className="flex bg-background flex-col ">
      <Header />
      <div id="hero-scroll-section" className="bg-muted/50 min-h-screen">
        <div className="container mx-auto flex flex-col items-stretch justify-center px-4 md:px-6 relative z-40 py-12">
          <div className="w-full grow h-full md:flex md:flex-col md:justify-center pt-24 gap-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl leading-tight md:leading-none text-center">
              <span className="block">Choose Time Slot</span>
            </h1>

            <div className="flex flex-col md:flex-row gap-6 md:gap-16">
              <div className="space-y-2 w-full max-w-3xl mx-auto">
                <Suspense fallback={<div>Loading...</div>}>
                  <SchedulerPageContent />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
