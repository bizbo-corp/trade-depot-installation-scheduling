"use client";

import * as React from "react";
import { Menu, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logotype } from "@/components/site-parts/logotype";

export const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navLinks = [
    { name: "Consultancy workshops", href: "#" },
    { name: "UX Design", href: "#" },
    { name: "Development", href: "#" },
    { name: "Shopify", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Logotype />
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button key={link.name} variant="ghost" asChild>
              <a href={link.href}>{link.name}</a>
            </Button>
          ))}
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <UserRound className="h-4 w-4" />
            <span className="sr-only">Account</span>
          </Button>
        </nav>
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>
                  <Logotype />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Button
                    key={link.name}
                    variant="ghost"
                    asChild
                    className="justify-start"
                  >
                    <a href={link.href} onClick={() => setIsOpen(false)}>
                      {link.name}
                    </a>
                  </Button>
                ))}
                <div className="flex items-center justify-between pt-4 border-t">
                  <ThemeToggle />
                  <Button variant="ghost" size="icon">
                    <UserRound className="h-4 w-4" />
                    <span className="sr-only">Account</span>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
