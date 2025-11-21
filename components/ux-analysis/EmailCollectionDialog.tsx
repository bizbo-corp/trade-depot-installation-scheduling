"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const emailCollectionSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
});

export type EmailCollectionData = z.infer<typeof emailCollectionSchema>;

interface EmailCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EmailCollectionData) => Promise<void>;
  isSubmitting?: boolean;
  screenshot?: string;
  isAnalyzing?: boolean;
}

export function EmailCollectionDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  screenshot,
  isAnalyzing = false,
}: EmailCollectionDialogProps) {
  const form = useForm<EmailCollectionData>({
    resolver: zodResolver(emailCollectionSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
    },
  });

  const handleSubmit = async (data: EmailCollectionData) => {
    await onSubmit(data);
    // Reset form after successful submission
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Get Your Report</DialogTitle>
          <DialogDescription className="text-primary">
            Your UX analysis report is nearly ready. Enter your details below to receive it via email in the next few minutes.
          </DialogDescription>
        </DialogHeader>

        {/* Screenshot display with loading state */}
        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
          {screenshot ? (
            <>
              <img
                src={screenshot}
                alt="Website screenshot"
                className="w-full h-full object-cover object-top"
              />
              {isAnalyzing && (
                <div className="absolute bottom-2 right-2 bg-background/90 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm border">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  <span className="text-xs font-medium">Analyzing...</span>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {isAnalyzing ? "Analysing website..." : "Report Preview Placeholder"}
              </p>
              {isAnalyzing && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile (Optional)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+64 21 123 4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Get My Report"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

