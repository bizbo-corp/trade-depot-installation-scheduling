"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/sections/Footer";
import { AdminEmailManager } from "@/components/admin/AdminEmailManager";

export default function AdminPage() {
  return (
    <div className="flex bg-background flex-col min-h-screen pt-24">
      <Header />
      <main className="flex-1 py-12">
        <AdminEmailManager />
      </main>
      <Footer />
    </div>
  );
}
