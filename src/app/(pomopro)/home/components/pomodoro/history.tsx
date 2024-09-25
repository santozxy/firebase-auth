import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History as HistoryIcon, Calendar } from "lucide-react";
import { Activity } from "@/domain/history/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getStatusColor, getStatusIcon, timeInMinutes } from "./helpers";

interface HistoryProps {
  activities: Activity[];
}

export function History({ activities }: HistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HistoryIcon className="mr-2" />
          Histórico de Atividades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[40rem] pr-4">
          {activities.length === 0 ? (
            <p>Nenhuma atividade registrada.</p>
          ) : (
            <ul className="space-y-4">
              {activities.map((activity, index) => (
                <li key={index} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{activity.name}</h3>
                    <Badge
                      variant="outline"
                      className={getStatusColor(activity.status)}
                    >
                      {getStatusIcon(activity.status)}
                      <span className="ml-1">{activity.status}</span>
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    {activity.startDate && (
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>
                          Início:{" "}
                          {new Date(activity.startDate).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {activity.endDate && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>
                          Fim: {new Date(activity.endDate).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>
                      Duração: {timeInMinutes(activity.duration)} minutos
                    </span>
                    <span>
                      Tempo trabalhado: {timeInMinutes(activity.timeWorked)}{" "}
                      minutos
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
