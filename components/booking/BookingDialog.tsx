"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function BookingDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="text-center p-4">
          <h2 className="text-lg font-semibold">Booking Feature</h2>
          <p className="text-muted-foreground">
            This feature is currently being updated.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
