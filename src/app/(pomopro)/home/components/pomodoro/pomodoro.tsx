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
    setActivities(newActivities);
    localStorage.setItem("activities", JSON.stringify(newActivities));
  }, []);

  const addActivity = (newActivity: Activity) => {
    updateActivities([...activities, newActivity]);
    if (!currentActivity && !timerActive) {
      startActivity(newActivity);
    }
  };

  const startActivity = (activity: Activity) => {
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
    setIsWorking(false);
    setTimeLeft(breakTime * 60);
    setIsRunning(true);
    setTimerActive(true);
  }, [breakTime]);

  const finishCurrentActivity = useCallback(() => {
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
    if (!isWorking) {
      setIsWorking(true);
      moveToNextActivity();
      setTimeLeft(0);
    }
  };

  const toggleTimer = () => {
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
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
        if (currentActivity) {
          setCurrentActivity((activity: Activity | null) =>
            activity
              ? { ...activity, timeWorked: activity.timeWorked + 1 }
              : null
          );
        }
      }, 1000);
    } else if (timeLeft === 0) {
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
