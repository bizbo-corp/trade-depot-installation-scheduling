"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/sections/Footer";

import { UXProcessAccordion } from "@/components/ux-analysis/UXProcessAccordion";
import { InstallationServices } from "@/components/sections/installation-services";
import { BookingFlow } from "@/components/BookingFlow";
import { DeliveryConfirmationGate } from "@/components/DeliveryConfirmationGate";

function BookingFlowWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId") || "666";
  return (
    <DeliveryConfirmationGate
      orderId={orderId}
      onConfirm={() => router.push(`/installation-details?orderId=${orderId}`)}
    />
  );
}

export default function Home() {
  return (
    <div className="flex bg-background flex-col ">
      <Header />
      <div id="hero-scroll-section" className="bg-foreground/20">
        <div className="container mx-auto flex flex-col items-stretch justify-center px-4 md:px-6 relative z-40 py-12">
          <div className="w-full grow h-full md:flex md:flex-col md:justify-center pt-24 gap-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl leading-tight md:leading-none text-center">
              <span className="block">Installation Booking</span>
            </h1>

            <div className="flex flex-col md:flex-row gap-6 md:gap-16">
              <div className="space-y-2 w-full">
                <Suspense fallback={<BookingFlow orderId="666" />}>
                  <BookingFlowWrapper />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
        <InstallationServices />
      </div>

      <div id="hero-scroll-section" className="">
        <div className="container mx-auto flex flex-col items-stretch  justify-center px-4 md:px-6 relative z-40">
          <div className="flex flex-col md:flex-row gap-6 md:gap-16">
            <div className="space-y-2 w-full">
              <UXProcessAccordion />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
