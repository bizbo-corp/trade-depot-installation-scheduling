"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/sections/Footer";

import { BookingDetailsForm } from "@/components/booking/BookingDetailsForm";

function BookingPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";

  return (
    <BookingDetailsForm
      orderId={orderId}
      initialData={{ firstName, lastName, email, phone }}
    />
  );
}

export default function InstallationDetailsPage() {
  return (
    <div className="flex bg-background flex-col ">
      <Header />
      <div id="hero-scroll-section" className="bg-foreground/10  min-h-screen">
        <div className="container mx-auto flex flex-col items-stretch px-4 md:px-6 relative z-40 py-12">
          <div className="w-full grow h-full md:flex md:flex-col pt-24 gap-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl leading-tight md:leading-none max-w-3xl mx-auto ">
              <span className="block">Installation Booking</span>
            </h1>

            <div className="flex flex-col md:flex-row gap-6 md:gap-16">
              <div className="space-y-2 w-full max-w-3xl mx-auto">
                <Suspense fallback={<div>Loading...</div>}>
                  <BookingPageContent />
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
