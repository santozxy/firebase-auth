"use client";

import React, { useState } from "react";
import { ActivityForm } from "./activity-form";
import { Timer } from "./timer";
import { Settings } from "./settings";
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
import { usePomodoroContext } from "@/context/pomodoro-context";

export function Pomodoro() {
  const {
    currentActivity,
    timeLeft,
    isWorking,
    isRunning,
    timerActive,
    breakTime,
    inProgressActivity,
    showDialog,
    addActivity,
    finishCurrentActivity,
    cancelActivity,
    skipBreak,
    toggleTimer,
    setBreakTime,
    handleResumeActivity,
    handleDeleteActivity,
    setShowDialog,
  } = usePomodoroContext();

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCancelActivity = () => {
    cancelActivity();
    setShowCancelDialog(false);
  };

  return (
    <div className="space-y-4">
      <ActivityForm onAddActivity={addActivity} />
      <Timer
        currentActivity={currentActivity}
        timeLeft={timeLeft}
        isWorking={isWorking}
        isRunning={isRunning}
        onToggleTimer={toggleTimer}
        onFinishActivity={finishCurrentActivity}
        onCancelActivity={() => setShowCancelDialog(true)}
        onSkipBreak={skipBreak}
      />
      <Settings
        breakTime={breakTime}
        onBreakTimeChange={setBreakTime}
        disabled={timerActive}
      />
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Atividade em andamento</AlertDialogTitle>
            <AlertDialogDescription>
              Existe uma atividade em andamento: {inProgressActivity?.name}.
              Deseja retomá-la?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteActivity}>
              Apagar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleResumeActivity}>
              Retomar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar atividade</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar a atividade atual? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              Não, continuar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelActivity}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, cancelar atividade
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
