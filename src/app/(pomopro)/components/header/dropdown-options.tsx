"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, User, Bell, BellOff } from "lucide-react";
import Image from "next/image";
import { ButtonLogout } from "./button-logout";
import { DropdownTheme } from "./dropdown-theme";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export function DropdownOptions() {
  const { user, loading } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  const toggleNotifications = async () => {
    if ("Notification" in window) {
      if (notificationsEnabled) {
        setNotificationsEnabled(false);
        toast({
          title: "Notificações desativadas",
          description:
            "Você não receberá mais notificações do nosso aplicativo.",
        });
      } else {
        const permission = await Notification.requestPermission();
        setNotificationsEnabled(permission === "granted");
        if (permission === "granted") {
          toast({
            title: "Notificações ativadas",
            description:
              "Você receberá notificações importantes do nosso aplicativo.",
          });
        }
      }
    }
  };
  const limitedName = user?.displayName?.split(" ")[0] || "Usuário";

  if (loading) return <Skeleton className="w-10 h-10 rounded-full" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-10 h-10 rounded-full p-0">
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt="Foto de perfil"
              width={40}
              height={40}
              className="w-full h-full rounded-full"
            />
          ) : (
            <User className="w-6 h-6" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-2 p-1">
            <p className="text-sm font-medium leading-none">
              {`Olá ${limitedName} 👋`}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || "usuario@exemplo.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Sun className="mr-2 h-4 w-4" />
            <span>Tema</span>
          </DropdownMenuSubTrigger>
          <DropdownTheme />
        </DropdownMenuSub>
        <DropdownMenuItem onClick={toggleNotifications}>
          {notificationsEnabled ? (
            <Bell className="mr-2 h-4 w-4" />
          ) : (
            <BellOff className="mr-2 h-4 w-4" />
          )}
          <span>Notificações</span>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={toggleNotifications}
            className="ml-auto"
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <ButtonLogout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
