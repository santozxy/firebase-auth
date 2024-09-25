
import { Timer } from "lucide-react";
import React from "react";
import { DropdownOptions } from "./dropdown-options";

export function Header() {
  return (
    <header className="p-4 flex justify-between items-center sticky top-0 z-50 border-b">
      <div className="flex items-center justify-center">
        <Timer className="h-8 w-8 mr-2" />
        <h1 className="text-2xl font-bold">PomoPro</h1>
      </div>
      <DropdownOptions />
    </header>
  );
}
