import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { BookingDialog } from "@/components/booking/BookingDialog";

const HERO_CHECKLIST = [
  "Build the right product with real customer value",
  "Test, gain buy-in, and secure funding fast",
  "Beat your competition to market",
];

export function CTAhome() {
  return (
    <div className="flex flex-col gap-8 md:max-w-2xl">
      <div className="flex flex-col gap-6 ">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-6xl">
          <span className="mb-2 block">Your app idea.</span>
          <span className="text-accent-foreground dark:text-accent-foreground">
            Bizbo clarity.
          </span>
        </h1>
        <p className="max-w-xl text-lg font-medium leading-relaxed text-foreground md:text-xl">
          Simplify the process of building a market-defining digital web app -
          one your customers can't live without and your rivals will desperately
          want to copy.
        </p>
      </div>
      <ul className="flex flex-col gap-4">
        {HERO_CHECKLIST.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-foreground md:h-6 md:w-6" />
            <span className="text-lg text-foreground/70 md:text-xl">
              {item}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-row gap-4 w-full">
        <BookingDialog>
          <Button variant="primary" size="lg" className="px-8 sm:w-auto">
            Schedule a call
          </Button>
        </BookingDialog>
        <Button variant="ghost" size="lg" className="px-8 sm:w-auto">
          Find out more
        </Button>
      </div>
    </div>
  );
}
