import React from "react";
import { DropdownOptions } from "./dropdown-options";

export function Header() {
  return (
    <header className="p-4 flex justify-between items-center sticky top-0 z-50 border-b">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Olá, Monnuery 👋</h1>
      </div>
      <DropdownOptions />
    </header>
  );
}
