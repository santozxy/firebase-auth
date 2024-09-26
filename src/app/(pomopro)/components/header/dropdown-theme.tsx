"use client";
import {
  DropdownMenuSubContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "next-themes";

export function DropdownTheme() {
  const { setTheme } = useTheme();
  return (
    <DropdownMenuSubContent>
      <DropdownMenuItem onClick={() => setTheme("light")}>
        <Sun className="mr-2 h-4 w-4" />
        <span>Claro</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("dark")}>
        <Moon className="mr-2 h-4 w-4" />
        <span>Escuro</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("system")}>
        <Laptop className="mr-2 h-4 w-4" />
        <span>Sistema</span>
      </DropdownMenuItem>
    </DropdownMenuSubContent>
  );
}
