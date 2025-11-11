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
import { NavThemeSwitcher } from "@/components/nav-theme-switcher";

export const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="block hover:bg-foreground/10 rounded-4xl p-2">
        <Logotype />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-1">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/design-thinker-workshops"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Design Workshops
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/ux-design"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            UX Design
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/development"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Development
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/automation"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Automation
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/test"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Test
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>                    
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <FlaskConical className="mr-2 h-4 w-4" />
                  Bizbo Labs
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-1">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="#"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Shopify
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="#"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            workshoppilot.ai
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="#"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            Cucina App
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="#">Contact</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <NavThemeSwitcher />
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
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-semibold text-muted-foreground">
                    Services
                  </div>
                  <Button
                    variant="ghost"
                    asChild
                    className="justify-start pl-6"
                  >
                    <a href="#" onClick={() => setIsOpen(false)}>
                      Consultancy
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    asChild
                    className="justify-start pl-6"
                  >
                    <a href="#" onClick={() => setIsOpen(false)}>
                      Workshops
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    asChild
                    className="justify-start pl-6"
                  >
                    <a href="#" onClick={() => setIsOpen(false)}>
                      UX Design
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    asChild
                    className="justify-start pl-6"
                  >
                    <a href="#" onClick={() => setIsOpen(false)}>
                      Development
                    </a>
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
                    <a href="#" onClick={() => setIsOpen(false)}>
                      Shopify
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    asChild
                    className="justify-start pl-6"
                  >
                    <a href="#" onClick={() => setIsOpen(false)}>
                      workshoppilot.ai
                    </a>
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  asChild
                  className="justify-start"
                >
                  <a href="#" onClick={() => setIsOpen(false)}>
                    Contact
                  </a>
                </Button>
                <div className="flex items-center justify-between gap-3 border-t pt-4">
                  <NavThemeSwitcher className="w-full justify-between" />
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
