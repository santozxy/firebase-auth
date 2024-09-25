"use client";

import { useState, useEffect, useCallback } from "react";

import { ActivityForm } from "./activity-form";
import { Timer } from "./timer";
import { Settings } from "./settings";
import { History } from "./history";
import { Activity } from "@/domain/history/types";

export function Pomodoro() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [breakTime, setBreakTime] = useState(5); // 5 minutes default
  const [timerActive, setTimerActive] = useState(false);

  const updateActivities = useCallback((newActivities: Activity[]) => {
    // Função de callback para atualizar a lista de atividades no estado e no localStorage
    setActivities(newActivities);
    localStorage.setItem("activities", JSON.stringify(newActivities));
  }, []);

  const addActivity = (newActivity: Activity) => {
    // Função de callback para adicionar uma nova atividade à lista de atividades
    updateActivities([...activities, newActivity]);
    if (!currentActivity && !timerActive) {
      startActivity(newActivity);
    }
  };

  const startActivity = (activity: Activity) => {
    // Função de callback para iniciar a atividade selecionada pelo usuário
    const now = new Date();
    setCurrentActivity({
      ...activity,
      status: "Em andamento",
      startDate: now.toISOString(),
    });
    setTimeLeft(activity.duration);
    setIsWorking(true);
    setIsRunning(true);
    setTimerActive(true);
  };

  const moveToNextActivity = useCallback(() => {
    // Função de callback para mover para a próxima atividade após a atual ser finalizada
    const nextActivity = activities.find((a) => a.status === "Pendente");
    if (nextActivity) {
      startActivity(nextActivity);
    } else {
      setCurrentActivity(null);
      setIsRunning(false);
      setTimerActive(false);
    }
  }, [activities]);

  const startBreak = useCallback(() => {
    // Função de callback para iniciar o intervalo entre atividades de trabalho
    setIsWorking(false);
    setTimeLeft(breakTime * 60);
    setIsRunning(true);
    setTimerActive(true);
  }, [breakTime]);

  const finishCurrentActivity = useCallback(() => {
    // Função de callback para finalizar a atividade atual e iniciar o intervalo
    if (currentActivity) {
      const now = new Date();
      const updatedActivities = activities.map((a) =>
        a.name === currentActivity.name
          ? {
              ...currentActivity,
              status: "Completa" as const,
              endDate: now.toISOString(),
            }
          : a
      );
      updateActivities(updatedActivities);
      setCurrentActivity(null);
      startBreak();
    }
  }, [activities, currentActivity, updateActivities, startBreak]);

  const cancelActivity = () => {
    // Função de callback para cancelar a atividade atual e iniciar o intervalo de descanso
    if (currentActivity) {
      const now = new Date();
      const updatedActivities = activities.map((a) =>
        a.name === currentActivity.name
          ? {
              ...currentActivity,
              status: "Cancelada",
              endDate: now.toISOString(),
            }
          : a
      );
      updateActivities(updatedActivities as Activity[]);
      setCurrentActivity(null);
      startBreak();
    }
  };

  const skipBreak = () => {
    // Função de callback para pular o intervalo de descanso e iniciar a próxima atividade
    if (!isWorking) {
      setIsWorking(true);
      moveToNextActivity();
      setTimeLeft(0);
    }
  };

  const toggleTimer = () => {
    // Função de callback para pausar ou retomar o cronômetro
    setIsRunning(!isRunning);
    if (!timerActive) {
      setTimerActive(true);
    }
  };

  useEffect(() => {
    const storedActivities = localStorage.getItem("activities");
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    }
  }, []);

  useEffect(() => {
    // Efeito colateral para controlar o tempo restante e atualizar o tempo trabalhado na atividade atual
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
        if (currentActivity) {
          // Atualiza o tempo trabalhado na atividade atual a cada segundo
          setCurrentActivity((activity: Activity | null) =>
            activity
              ? { ...activity, timeWorked: activity.timeWorked + 1 }
              : null
          );
        }
      }, 1000);
    } else if (timeLeft === 0) {
      // Finaliza a atividade atual e inicia o intervalo de descanso após o término do tempo
      if (isWorking) {
        finishCurrentActivity();
      } else {
        setIsWorking(true);
        moveToNextActivity();
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isRunning,
    timeLeft,
    isWorking,
    currentActivity,
    finishCurrentActivity,
    moveToNextActivity,
  ]);

  return (
    <div className="p-4 w-full grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
      <div className="space-y-4">
        <ActivityForm onAddActivity={addActivity} disabled={timerActive} />
        <Timer
          currentActivity={currentActivity}
          timeLeft={timeLeft}
          isWorking={isWorking}
          isRunning={isRunning}
          onToggleTimer={toggleTimer}
          onFinishActivity={finishCurrentActivity}
          onCancelActivity={cancelActivity}
          onSkipBreak={skipBreak}
        />
        <Settings
          breakTime={breakTime}
          onBreakTimeChange={setBreakTime}
          disabled={timerActive}
        />
      </div>
      <History activities={activities} />
    </div>
  );
}
