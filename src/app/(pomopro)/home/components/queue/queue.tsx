"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutList } from "lucide-react";
import { Activity } from "@/domain/history/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase/config";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { Loading } from "./loading";
import { CardActivity } from "@/app/(pomopro)/components/card-activity/card-activity";

export interface ActivityWithId extends Activity {
  id: string;
}

export function Queue() {
  const [activities, setActivities] = useState<ActivityWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { uuid, activitiesCollection } = useAuth();

  useEffect(() => {
    if (!uuid || !activitiesCollection) return;
    setIsLoading(true);
    const q = query(
      activitiesCollection,
      orderBy("startDate", "desc"),
      where("status", "in", ["Pendente", "Em andamento"])
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedActivities: ActivityWithId[] = [];
      querySnapshot.forEach((doc) => {
        fetchedActivities.push({ id: doc.id, ...doc.data() } as ActivityWithId);
      });
      setActivities(fetchedActivities);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [uuid, activitiesCollection]);

  const handleDelete = useCallback(
    async (activity: ActivityWithId) => {
      if (!uuid || !activity.id) return;

      if (activity.status === "Em andamento") {
        return toast({
          itemID: "activity-delete-error",
          title: "Erro",
          description: "Não é possível excluir uma atividade em andamento.",
          variant: "destructive",
        });
      }

      try {
        await deleteDoc(doc(db, "users", uuid, "activities", activity.id));
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
    [uuid]
  );

  const memoizedActivities = useMemo(() => activities, [activities]);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center">
          <LayoutList className="mr-2" aria-hidden="true" />
          Fila de atividades
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
            <div className="">
              {memoizedActivities.map((activity) => (
                <CardActivity
                  key={activity.id}
                  activity={activity}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
