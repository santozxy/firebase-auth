"use client";
import React from "react";
import { DropdownOptions } from "./dropdown-options";
import { useAuth } from "@/hooks/use-auth";
export function Header() {
  const { user, loading } = useAuth();
  const message = `Olá, ${user?.displayName ?? user?.email} 👋`;

  if (loading)
    return (
      <header className="p-4 flex justify-between items-center sticky top-0 z-50 border-b">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-semibold">Carregando...</h1>
        </div>
      </header>
    );

  return (
    <header className="p-4 flex justify-between items-center sticky top-0 z-50 border-b">
      <div className="flex items-center justify-center">
        <h1 className="text-xl font-semibold">{message}</h1>
      </div>
      <DropdownOptions />
    </header>
  );
}
