"use client";

import React, { useState } from "react";
import { DropdownOptions } from "./dropdown-options";
import Image from "next/image";
import logoLight from "../../../../../public/logo-light.png";
import logoDark from "../../../../../public/logo-dark.png";
import Nav from "./nav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="h-16 px-4 flex justify-between items-center sticky top-0 z-50 border-b bg-background">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="sm:hidden">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <h1 className="sm:text-2xl text-xl text-left pl-4 font-bold">PomoPro</h1>
          </SheetHeader>
          <MobileNav setIsOpen={setIsOpen} />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2 max-sm:hidden">
        <Image
          src={logoLight}
          alt="PomoPro"
          width={35}
          height={35}
          className="rounded-full dark:block hidden"
        />
        <Image
          src={logoDark}
          alt="PomoPro"
          width={35}
          height={35}
          className="rounded-full dark:hidden"
        />
        <h1 className="sm:text-2xl font-bold">PomoPro</h1>
      </div>
      <div className="hidden sm:block">
        <Nav />
      </div>
      <div className="flex items-center gap-2">
        <DropdownOptions />
      </div>
    </header>
  );
}
