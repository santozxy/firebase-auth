import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { getStatusColor, getStatusIcon, timeInMinutes } from "../helpers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ActivityWithId } from "./history";

interface ActivityItemProps {
  activity: ActivityWithId;
  onDelete: (activity: ActivityWithId) => void;
}

export function ActivityItem({ activity, onDelete }: ActivityItemProps) {
  return (
    <li className="border-b pb-6 last:border-b-0">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{activity.name}</h3>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={getStatusColor(activity.status)}>
            {getStatusIcon(activity.status)}
            <span className="ml-1">{activity.status}</span>
          </Badge>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={activity.status === "Em andamento"}
                aria-label="Excluir atividade"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir esta atividade? Esta ação não
                  pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(activity)}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        {activity.startDate && (
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <span>Início: {new Date(activity.startDate).toLocaleString()}</span>
          </div>
        )}
        {activity.endDate && (
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <span>Fim: {new Date(activity.endDate).toLocaleString()}</span>
          </div>
        )}
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Duração: {timeInMinutes(activity.duration)} minutos</span>
        <span>
          Tempo trabalhado: {timeInMinutes(activity.timeWorked)} minutos
        </span>
      </div>
    </li>
  );
}
