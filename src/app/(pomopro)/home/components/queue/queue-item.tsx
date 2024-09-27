import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Clock, Calendar, Tag } from "lucide-react";

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
import { ActivityWithId } from "./queue";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatTime } from "@/utils/date-format";
import { timeInMinutes, formatDate } from "@/utils/date-format";
import { getStatusColor, getStatusIcon } from "@/utils/getValues";

interface ActivityItemProps {
  activity: ActivityWithId;
  onDelete: (activity: ActivityWithId) => void;
}

export function QueueItem({ activity, onDelete }: ActivityItemProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{activity.name}</CardTitle>
          <div className="flex items-center space-x-2">
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
                  size="icon"
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
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
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
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Duração: {timeInMinutes(activity.duration)} min</span>
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
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Início: {formatDate(activity.startDate)}</span>
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
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Fim: {formatDate(activity.endDate)}</span>
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
      <CardFooter className="pt-2">
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
