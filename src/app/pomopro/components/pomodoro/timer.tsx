"use client";

import React, { useState, useEffect } from "react";
import { usePomodoroContext } from "@/context/pomodoro-context";
import { Button } from "@/components/ui/button";

export function Timer() {
  const { currentActivity, completeActivity } = usePomodoroContext();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (currentActivity) {
      setTimeLeft(currentActivity.duration * 60);
      setIsActive(true);
    }
  }, [currentActivity]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && currentActivity) {
      completeActivity(currentActivity.id);
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, currentActivity, completeActivity]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (!currentActivity) {
    return (
      <div className="text-center text-xl">Nenhuma atividade selecionada</div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold">{currentActivity.name}</h2>
      <div className="text-4xl font-mono">{formatTime(timeLeft)}</div>
      <Button onClick={toggleTimer}>{isActive ? "Pausar" : "Continuar"}</Button>
    </div>
  );
}
