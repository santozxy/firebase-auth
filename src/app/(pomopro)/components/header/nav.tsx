"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History } from "lucide-react";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/home", label: "Início", icon: Home },
    { href: "/history", label: "Histórico", icon: History },
  ];

  return (
    <nav className="flex items-center justify-center p-4 gap-4 rounded-lg">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex gap-2 items-center text-center px-3 py-1.5 border-b border-transparent transition-colors duration-200 ${
              isActive
                ? "text-primary font-bold border-primary"
                : "text-foreground hover:text-primary"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
