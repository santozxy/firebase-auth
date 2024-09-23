"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { HistorySidebar } from "./history";

type ActivityType = "Trabalho" | "Estudo" | "Exercício" | "Outro";
type ActivityStatus = "Concluído" | "Cancelado";
type TimerMode = "Activity" | "Rest";

interface Activity {
  name: string;
  type: ActivityType;
  duration: number;
  timeWorked: number;
  status: ActivityStatus;
  reason: string;
  completedAt: Date;
}

export function Pomodoro() {
  const [activityName, setActivityName] = useState("");
  const [activityType, setActivityType] = useState<ActivityType>("Trabalho");
  const [duration, setDuration] = useState(25);
  const [restDuration, setRestDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [history, setHistory] = useState<Activity[]>([]);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);

  const [timerMode, setTimerMode] = useState<TimerMode>("Activity");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem("pomodoroHistory");
    if (savedHistory) {
      setHistory(
        JSON.parse(savedHistory).map((activity: Activity) => ({
          ...activity,
          completedAt: new Date(activity.completedAt),
        }))
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pomodoroHistory", JSON.stringify(history));
  }, [history]);

  const handleFinish = useCallback(
    (autoComplete: boolean) => {
      setIsActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      const timeWorked = startTimeRef.current
        ? Math.floor((Date.now() - startTimeRef.current) / 1000)
        : duration * 60;
      const newActivity: Activity = {
        name: activityName,
        type: activityType,
        duration: duration,
        timeWorked,
        status: "Concluído",
        reason: autoComplete ? "Tempo finalizado automaticamente" : "",
        completedAt: new Date(),
      };
      setHistory((prev) => [newActivity, ...prev]);
      toast({
        title: "Pomodoro Finalizado!",
        description: `${activityName} - Concluído`,
      });

      setTimeLeft(restDuration * 60);
      startTimeRef.current = Date.now();
      setTimerMode("Rest");
      setIsActive(true);
      setActivityName("");
      setActivityType("Trabalho");
      setDuration(25);
    },
    [activityName, activityType, duration, restDuration, toast]
  );

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            if (timerMode === "Activity") {
              console.log("Activity finished");
              handleFinish(true);
            } else {
              setIsActive(false);
              setTimerMode("Activity");
              setTimeLeft(duration * 60);
              toast({
                title: "Descanso Finalizado!",
                description: "Hora de voltar ao trabalho!",
              });
            }
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [handleFinish, isActive, timeLeft, timerMode, duration, toast]);

  const handleStart = () => {
    if (!activityName || !activityType || duration <= 0 || restDuration <= 0) {
      toast({
        title: "Entrada Inválida",
        description: "Por favor, preencha todos os campos corretamente.",
        variant: "destructive",
      });
      return;
    }
    setIsActive(true);
    setTimeLeft(duration * 60);
    startTimeRef.current = Date.now();
    setTimerMode("Activity");
  };

  const handleReset = () => {
    setShowResetConfirmation(true);
  };

  const confirmReset = () => {
    setIsActive(false);
    setTimeLeft(timerMode === "Activity" ? duration * 60 : restDuration * 60);
    startTimeRef.current = null;
    setShowResetConfirmation(false);
  };

  const handleSkipRest = () => {
    if (timerMode === "Rest") {
      setIsActive(false);
      setTimerMode("Activity");
      setTimeLeft(duration * 60);
      toast({
        title: "Descanso Pulado",
        description: "Iniciando nova atividade.",
      });
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    if (!isActive && timerMode === "Activity") {
      setTimeLeft(newDuration * 60);
    }
  };

  const handleRestDurationChange = (newRestDuration: number) => {
    setRestDuration(newRestDuration);
    if (!isActive && timerMode === "Rest") {
      setTimeLeft(newRestDuration * 60);
    }
  };

  const progress =
    1 - timeLeft / ((timerMode === "Activity" ? duration : restDuration) * 60);

  return (
    <div className="grid sm:grid-cols-[2fr_1fr] gap-4 place-items-center justify-center bg-gray-100">
      <Card className="w-full">
        <CardContent className="p-6 h-[49rem]">
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="activityName" className="text-sm font-medium">
                Nome da atividade
              </Label>
              <Input
                id="activityName"
                type="text"
                placeholder="Digite o nome da atividade"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                disabled={isActive}
              />
            </div>
            <div>
              <Label htmlFor="activityType" className="text-sm font-medium">
                Tipo de atividade
              </Label>
              <Select
                value={activityType}
                onValueChange={(value: ActivityType) => setActivityType(value)}
                disabled={isActive}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trabalho">Trabalho</SelectItem>
                  <SelectItem value="Estudo">Estudo</SelectItem>
                  <SelectItem value="Exercício">Exercício</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration" className="text-sm font-medium">
                Duração da atividade (minutos)
              </Label>
              <Input
                id="duration"
                type="number"
                placeholder="Digite a duração"
                value={duration}
                onChange={(e) => handleDurationChange(Number(e.target.value))}
                min={1}
                max={60}
                disabled={isActive}
              />
            </div>
            <div>
              <Label htmlFor="restDuration" className="text-sm font-medium">
                Duração do descanso (minutos)
              </Label>
              <Input
                id="restDuration"
                type="number"
                placeholder="Digite a duração do descanso"
                value={restDuration}
                onChange={(e) =>
                  handleRestDurationChange(Number(e.target.value))
                }
                min={1}
                max={30}
                disabled={isActive}
              />
            </div>
          </div>

          <div className="relative w-64 h-64 mx-auto my-8">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-secondary"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
              />
              <motion.circle
                className={
                  timerMode === "Activity" ? "text-primary" : "text-green-500"
                }
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
                initial={{ strokeDasharray: "0 283" }}
                animate={{ strokeDasharray: `${progress * 283} 283` }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-6xl font-bold"
                key={timeLeft}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {formatTime(timeLeft)}
              </motion.div>
            </div>
          </div>

          <div className="text-center mb-4">
            <span
              className={`font-bold ${
                timerMode === "Activity" ? "text-primary" : "text-green-500"
              }`}
            >
              {timerMode === "Activity" ? "Atividade" : "Descanso"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleStart} disabled={isActive}>
              Iniciar
            </Button>
            <Button onClick={handleReset} disabled={!isActive}>
              Reiniciar
            </Button>
            <Button
              onClick={() => setShowFinishConfirmation(true)}
              disabled={!isActive || timerMode === "Rest"}
            >
              Finalizar
            </Button>
            <Button
              onClick={handleSkipRest}
              disabled={!isActive || timerMode === "Activity"}
            >
              Pular Descanso
            </Button>
          </div>

          <AlertDialog
            open={showResetConfirmation}
            onOpenChange={setShowResetConfirmation}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Reinício</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja reiniciar o timer? Todo o progresso
                  atual será perdido.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmReset}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={showFinishConfirmation}
            onOpenChange={setShowFinishConfirmation}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Finalização</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja finalizar a atividade atual?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setShowFinishConfirmation(false);
                    handleFinish(false);
                  }}
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
      <HistorySidebar history={history} />
    </div>
  );
}
