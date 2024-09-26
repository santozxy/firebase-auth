"use client";
import React from "react";
import { DropdownOptions } from "./dropdown-options";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import logo from "@/app/icon.png";
export function Header() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <header className="p-4 flex justify-between items-center sticky top-0 z-50 border-b">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-semibold">Carregando...</h1>
        </div>
      </header>
    );

  return (
    <header className="p-4 flex justify-between items-center sticky top-0 z-50 border-b bg-background">
      <div className="flex items-center justify-center">
        {user?.displayName && (
          <h1 className="text-xl font-semibold">Olá, {user.displayName}! 👋</h1>
        )}
        {!user?.displayName && (
          <Image
            src={logo}
            alt="PomoPro"
            width={50}
            height={50}
            className="rounded-full"
          />
        )}
      </div>
      <DropdownOptions />
    </header>
  );
}
