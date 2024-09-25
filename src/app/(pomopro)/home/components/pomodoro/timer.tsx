import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Pause, Play, CheckCircle, XCircle, SkipForward } from "lucide-react";
import { formatTime } from "./helpers";
import { Activity } from "@/domain/history/types";

interface TimerProps {
  currentActivity: Activity | null;
  timeLeft: number;
  isWorking: boolean;
  isRunning: boolean;
  onToggleTimer: () => void;
  onFinishActivity: () => void;
  onCancelActivity: () => void;
  onSkipBreak: () => void;
}

export function Timer({
  currentActivity,
  timeLeft,
  isWorking,
  isRunning,
  onToggleTimer,
  onFinishActivity,
  onCancelActivity,
  onSkipBreak,
}: TimerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2" />
          Tempo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <h2 className="text-7xl font-sembold mb-4" aria-live="polite">
            {formatTime(timeLeft)}
          </h2>
          <p className="text-xl mb-4">
            {isWorking
              ? currentActivity
                ? currentActivity.name
                : "Nenhuma atividade em andamento"
              : "Tempo de descanso"}
          </p>
          <Badge
            variant={isWorking ? "default" : "secondary"}
            className="mb-4"
          >
            {isWorking ? "Trabalhando" : "Descansando"}
          </Badge>
          <div className="space-x-2">
            <Button
              onClick={onToggleTimer}
              disabled={!timeLeft}
            >
              {isRunning ? (
                <Pause className="mr-2 h-4 w-4" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isRunning ? "Pausar" : "Iniciar"}
            </Button>
            {isWorking ? (
              <>
                <Button
                  onClick={onFinishActivity}
                  disabled={!currentActivity}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Finalizar
                </Button>
                <Button
                  onClick={onCancelActivity}
                  disabled={!currentActivity}
                >
                  <XCircle className="mr-2 h-4 w-4" /> Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={onSkipBreak}>
                <SkipForward className="mr-2 h-4 w-4" /> Pular Descanso
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}