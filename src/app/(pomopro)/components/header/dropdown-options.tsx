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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DropdownOptions() {
  const { user, loading } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const checkNotificationPermission = async () => {
      if ("Notification" in window) {
        const storedPermission = localStorage.getItem("notificationsEnabled");
        if (storedPermission === null) {
          setShowDialog(true);
        } else {
          setNotificationsEnabled(storedPermission === "true");
        }
      }
    };

    checkNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      const isEnabled = permission === "granted";
      setNotificationsEnabled(isEnabled);
      localStorage.setItem("notificationsEnabled", isEnabled.toString());
      setShowDialog(false);
      toast({
        title: isEnabled ? "Notificações ativadas" : "Notificações desativadas",
        description: isEnabled
          ? "Você receberá notificações importantes do nosso aplicativo."
          : "Você não receberá notificações do nosso aplicativo.",
      });
    }
  };

  const toggleNotifications = async () => {
    if ("Notification" in window) {
      if (notificationsEnabled) {
        localStorage.setItem("notificationsEnabled", "false");
        setNotificationsEnabled(false);
        toast({
          title: "Notificações desativadas",
          description:
            "Você não receberá mais notificações do nosso aplicativo.",
        });
      } else {
        await requestNotificationPermission();
      }
    }
  };

  const limitedName = user?.displayName?.split(" ")[0] || "Usuário";

  if (loading) return <Skeleton className="w-10 h-10 rounded-full" />;

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permitir notificações?</DialogTitle>
            <DialogDescription>
              Gostaríamos de enviar notificações importantes para você. Você
              pode alterar essa configuração a qualquer momento.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => requestNotificationPermission()}
            >
              Não permitir
            </Button>
            <Button onClick={() => requestNotificationPermission()}>
              Permitir
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-10 h-10 rounded-full p-0">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Foto de perfil"
                width={32}
                height={32}
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
    </>
  );
}
