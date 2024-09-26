"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History as HistoryIcon } from "lucide-react";
import { Activity } from "@/domain/history/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase/config";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { HistoryItem } from "./history-item";
import { Loading } from "./loading";

export interface ActivityWithId extends Activity {
  id: string;
}

export function History() {
  const [activities, setActivities] = useState<ActivityWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth().user;

  useEffect(() => {
    if (!auth?.uid) return;

    setIsLoading(true);
    const activitiesCollection = collection(
      db,
      "users",
      auth.uid,
      "activities"
    );
    const q = query(activitiesCollection, orderBy("startDate", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedActivities: ActivityWithId[] = [];
      querySnapshot.forEach((doc) => {
        fetchedActivities.push({ id: doc.id, ...doc.data() } as ActivityWithId);
      });
      setActivities(fetchedActivities);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth?.uid]);

  const handleDelete = useCallback(
    async (activity: ActivityWithId) => {
      if (!auth?.uid || !activity.id) return;

      if (activity.status === "Em andamento") {
        return toast({
          className: "bg-background",
          itemID: "activity-delete-error",
          title: "Erro",
          description: "Não é possível excluir uma atividade em andamento.",
          variant: "destructive",
        });
      }

      try {
        await deleteDoc(doc(db, "users", auth.uid, "activities", activity.id));
        toast({
          itemID: "activity-delete-success",
          title: "Sucesso",
          description: "Atividade excluída com sucesso.",
        });
      } catch (error) {
        toast({
          itemID: "activity-delete-error",
          title: "Erro",
          description:
            "Falha ao excluir atividade. Por favor, tente novamente.",
          variant: "destructive",
        });
        console.error("Error deleting activity:", error);
      }
    },
    [auth?.uid]
  );

  const memoizedActivities = useMemo(() => activities, [activities]);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center">
          <HistoryIcon className="mr-2" aria-hidden="true" />
          Histórico de Atividades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[44rem] pr-4">
          {isLoading ? (
            <ul className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <li key={index}>
                  <Loading />
                </li>
              ))}
            </ul>
          ) : memoizedActivities.length === 0 ? (
            <p>Nenhuma atividade registrada.</p>
          ) : (
            <ul className="space-y-4">
              {memoizedActivities.map((activity) => (
                <HistoryItem
                  key={activity.id}
                  activity={activity}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
