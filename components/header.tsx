"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, UserRound, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logotype } from "@/components/site-parts/logotype";
import { FaIcon } from "./ui/fa-icon";

export const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-2 md:py-12 bg-red-500/00">
        <Link href="/" className="block hover:bg-muted-foreground/10 rounded-xl py-1 pr-2">
          <div className="flex flex-row items-center justify-start gap-2">
            <Logotype />
            <h1 className="text-lg font-bold">
              Installation Services
            </h1>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="https://tradedepot.co.nz/" target="new">
                    tradedepot.co.nz
                    <FaIcon icon="arrow-up-right" className="ml-2 h-4 w-4" />
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Link href="https://tradedepot.co.nz/login.php">
              <UserRound className="h-4 w-4" />
              <span className="sr-only">Account</span>
            </Link>
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
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-semibold text-muted-foreground">
                    Services
                  </div>
                  <Button
                    variant="ghost"
                    asChild
                    className="justify-start pl-6"
                  >
                    <Link
                      href="/purpose-framework"
                      onClick={() => setIsOpen(false)}
                    >
                      Consultancy
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    asChild
                    className="justify-start pl-6"
                  >
                    <Link
                      href="/design-thinker-workshops"
                      onClick={() => setIsOpen(false)}
                    >
                      Workshops
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    asChild
                    className="justify-start pl-6"
                  >
                    <Link href="/ux-design" onClick={() => setIsOpen(false)}>
                      UX Design
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    asChild
                    className="justify-start pl-6"
                  >
                    <Link href="/development" onClick={() => setIsOpen(false)}>
                      Development
                    </Link>
                  </Button>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <FlaskConical className="h-4 w-4" />
                    Labs
                  </div>
                  <Button
                    variant="ghost"
                    asChild
                    className="justify-start pl-6"
                  >
                    <Link href="#" onClick={() => setIsOpen(false)}>
                      Shopify
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    asChild
                    className="justify-start pl-6"
                  >
                    <Link
                      href="https://workshoppilot.ai"
                      target="_blank"
                      onClick={() => setIsOpen(false)}
                    >
                      workshoppilot.ai
                    </Link>
                  </Button>
                </div>
                <Button variant="ghost" asChild className="justify-start">
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    Contact
                  </Link>
                </Button>
                <div className="flex items-center justify-between gap-3 border-t pt-4">
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
