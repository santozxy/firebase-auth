
import React from "react";
import { DropdownOptions } from "./dropdown-options";
import Image from "next/image";
import logo from "@/app/icon.png";

export function Header() {
  return (
    <header className="h-16 px-4 flex justify-between items-center sticky top-0 z-50 border-b bg-background">
      <div className="flex items-center gap-2">
        <Image
          src={logo}
          alt="PomoPro"
          width={30}
          height={30}
          className="rounded-full"
        />
        <h1 className="text-2xl font-bold">PomoPro</h1>
      </div>
      <div className="flex items-center gap-2">
        <DropdownOptions />
      </div>
    </header>
  );
}
