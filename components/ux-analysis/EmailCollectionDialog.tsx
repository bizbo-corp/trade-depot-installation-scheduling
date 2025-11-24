"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export type EmailCollectionData = {
  email: string;
  firstName: string;
  lastName: string;
  mobile?: string;
};

type EmailCollectionDialogProps = {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: EmailCollectionData) => Promise<void>;
  isSubmitting?: boolean;
  screenshot?: string;
  isAnalyzing?: boolean;
  onSuccess?: (data: EmailCollectionData) => void; // Keep this just in case
};

export function EmailCollectionDialog({
  children,
  open,
  onOpenChange,
}: EmailCollectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div>Email Collection Placeholder</div>
        {children}
      </DialogContent>
    </Dialog>
  );
}
