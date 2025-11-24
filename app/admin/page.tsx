"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/sections/Footer";
import InstallationBookingOverlay from "@/components/InstallationBookingOverlay";

export default function AdminPage() {
  return (
    <div className="flex bg-background flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <InstallationBookingOverlay embedded={true} defaultMode="admin" />
      </main>
      <Footer />
    </div>
  );
}
