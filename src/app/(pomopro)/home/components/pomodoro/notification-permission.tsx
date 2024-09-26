import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NotificationPermissionModalProps {
  onRequestPermission: () => void;
  onDismiss: () => void;
}

export function NotificationPermission({
  onRequestPermission,
  onDismiss,
}: NotificationPermissionModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleRequestPermission = () => {
    setIsOpen(false);
    onRequestPermission();
  };

  const handleDismiss = () => {
    setIsOpen(false);
    onDismiss();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ativar Notificações</DialogTitle>
          <DialogDescription>
            Gostaríamos de enviar notificações para te manter atualizado sobre
            suas atividades e intervalos. Isso ajudará você a manter o foco e a
            produtividade.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleDismiss}>
            Agora não
          </Button>
          <Button onClick={handleRequestPermission}>Ativar Notificações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
