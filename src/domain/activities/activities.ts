// In @/app/lib/firebase/activities.ts

import { db } from "@/app/lib/firebase/config";
import { toast } from "@/hooks/use-toast";
import {
  query,
  where,
  getDocs,
  deleteDoc,
  CollectionReference,
  doc,
} from "firebase/firestore";

export async function deleteInProgressAndPendingActivities(
  activitiesCollection: CollectionReference
) {
  const q = query(
    activitiesCollection,
    where("status", "in", ["Em andamento", "Pendente"])
  );

  try {
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log("All in-progress and pending activities deleted successfully");
  } catch (error) {
    console.error("Error deleting activities:", error);
  }
}

export async function deleteAcitivity(uuid: string, id: string) {
  try {
    await deleteDoc(doc(db, "users", uuid, "activities", id));
    toast({
      itemID: "activity-delete-success",
      title: "Sucesso",
      description: "Atividade excluída com sucesso.",
    });
  } catch (error) {
    toast({
      itemID: "activity-delete-error",
      title: "Erro",
      description: "Falha ao excluir atividade. Por favor, tente novamente.",
      variant: "destructive",
    });
    console.error("Error deleting activity:", error);
  }
}
