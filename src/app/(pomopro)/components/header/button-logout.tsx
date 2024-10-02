"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "@/app/lib/firebase/auth";
import { deleteInProgressAndPendingActivities } from "@/domain/activities/activities";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCollection } from "@/hooks/use-collections";
import { CollectionReference } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

export const ButtonLogout = React.forwardRef<HTMLButtonElement>(
  function ButtonLogout(_, ref) {
    const { activitiesCollection } = useCollection();
    const router = useRouter();
    const [deleteActivities, setDeleteActivities] = useState(false);

    const handleSignOut = async () => {
      if (deleteActivities) {
        await deleteInProgressAndPendingActivities(
          activitiesCollection as CollectionReference
        );
      }
      try {
        await signOut();
        toast({
          title: "Sucesso",
          description: "Você saiu da sua conta com sucesso.",
        });
        router.push("/login");
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button ref={ref} variant="outline" className="w-full h-8">
            Sair
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Você tem certeza que deseja sair?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Atenção: Ao sair, você perderá todo o progresso não salvo do seu
              trabalho atual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Checkbox
              id="delete-activities"
              checked={deleteActivities}
              onCheckedChange={(checked) =>
                setDeleteActivities(checked as boolean)
              }
            />
            <Label htmlFor="delete-activities">
              Excluir todas as atividades em andamento e pendentes
            </Label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);
