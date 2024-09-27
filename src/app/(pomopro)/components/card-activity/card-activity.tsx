import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Trash2,
  Clock,
  Tag,
  CheckCircle,
  XCircle,
  Play,
  Pause,
} from "lucide-react";

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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatTime } from "@/utils/date-format";
import { timeInMinutes, formatDate } from "@/utils/date-format";
import { Activity } from "@/domain/history/types";

export interface ActivityWithId extends Activity {
  id: string;
}

interface ActivityItemProps {
  activity: ActivityWithId;
  onDelete: (activity: ActivityWithId) => void;
}
export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completa":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Cancelada":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "Em andamento":
      return <Clock className="h-4 w-4 text-blue-500" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-500" />;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Completa":
      return "text-green-800 p-1.5";
    case "Cancelada":
      return "text-red-800 p-1.5";
    case "Em andamento":
      return "text-blue-800 p-1.5";
    default:
      return "text-orange-800 p-1.5";
  }
};

export function CardActivity({ activity, onDelete }: ActivityItemProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{activity.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={getStatusColor(activity.status)}
            >
              {getStatusIcon(activity.status)}
              <span className="ml-1">{activity.status}</span>
            </Badge>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activity.status === "Em andamento"}
                  aria-label="Excluir atividade"
                >
                  <Trash2
                    className="h-4 w-4 text-destructive"
                    aria-hidden="true"
                  />
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
      </CardHeader>
      <CardContent className="gap-4">
        <div className="grid grid-cols-1 w-full sm:grid-cols-2 gap-4 text-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex w-full items-center justify-start">
                  <Tag className="h-4 w-4 mr-2" />
                  <span>{activity.classification ?? "Não informado"}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Classificação da atividade</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex w-full items-center sm:justify-end">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    Duração Total: {timeInMinutes(activity.duration)}min
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Duração planejada da atividade</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {activity.startDate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex w-full items-center ">
                    <Play className="h-4 w-4 mr-2" />
                    <span> {formatDate(activity.startDate)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Data e hora de início da atividade</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {activity.endDate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex w-full items-center sm:justify-end">
                    <Pause className="h-4 w-4 mr-2" />
                    <span>{formatDate(activity.endDate)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Data e hora de término da atividade</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full bg-secondary rounded-full h-2 dark:bg-secondary-foreground/25">
          <div
            className="bg-primary h-2 rounded-full dark:bg-primary-foreground"
            style={{
              width: `${(activity.timeWorked / activity.duration) * 100}%`,
            }}
          ></div>
        </div>
      </CardFooter>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Tempo trabalhado: {formatTime(activity.timeWorked)} min
          {activity.timeWorked > 0 &&
            ` (${((activity.timeWorked / activity.duration) * 100).toFixed(
              0
            )}%)`}
        </p>
      </CardFooter>
    </Card>
  );
}
