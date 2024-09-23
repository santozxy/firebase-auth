import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "@/domain/history/types";
import { formatTime } from "@/lib/utils";

interface HistorySidebarProps {
  history: Activity[];
}

export function HistorySidebar({ history }: HistorySidebarProps) {
  return (
    <Card className="w-full">
      <CardContent className="h-[49rem] p-4">
        <h1 className="text-lg font-semibold">Histórico</h1>
        <ScrollArea className="h-[42rem]">
          {history.map((activity, index) => (
            <Card key={index} className="bg-secondary">
              <CardContent className="p-4">
                <p className="font-semibold">{activity.name}</p>
                <p className="text-sm text-muted-foreground">{activity.type}</p>
                <p className="text-sm">Duração: {activity.duration} min</p>
                <p className="text-sm">
                  Trabalhado: {formatTime(activity.timeWorked)}
                </p>
                <p className="text-sm">Status: {activity.status}</p>
                {activity.reason && (
                  <p className="text-sm">Motivo: {activity.reason}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(activity.completedAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
