"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutList } from "lucide-react";
import { Activity } from "@/domain/history/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { query, orderBy, onSnapshot, where } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { Loading } from "./loading";
import { CardActivity } from "@/app/(pomopro)/components/card-activity/card-activity";
import { revalidateRequest } from "@/app/actions/revalidate-tag";
import { deleteAcitivity } from "@/domain/activities/activities";
import { usePomodoroContext } from "@/context/pomodoro-context";

export interface ActivityWithId extends Activity {
  id: string;
}

export function Queue() {
  const [activities, setActivities] = useState<ActivityWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { uuid, activitiesCollection } = useAuth();
  const { removeActivity } = usePomodoroContext(); // Adicione esta linha
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

  const onDelete = async (activityID: string) => {
    await revalidateRequest("getHistoryActivity");
    if (!uuid) return;
    await deleteAcitivity(uuid, activityID);
    removeActivity(activityID); // Adicione esta linha
  };

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
                  onDelete={() => onDelete(activity.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
