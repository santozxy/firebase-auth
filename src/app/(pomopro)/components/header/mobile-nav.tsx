"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, History } from "lucide-react"

interface MobileNavProps {
  setIsOpen: (isOpen: boolean) => void
}

export  function MobileNav({ setIsOpen }: MobileNavProps) {
  const pathname = usePathname()

  const links = [
    { href: "/home", label: "Início", icon: Home },
    { href: "/history", label: "Histórico", icon: History },
  ]

  return (
    <nav className="flex flex-col space-y-4 mt-4">
      {links.map((link) => {
        const isActive = pathname === link.href
        const Icon = link.icon
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
              isActive
                ? "bg-primary-foreground text-primary font-bold"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Icon className="w-5 h-5 mr-2" />
            <span>{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}