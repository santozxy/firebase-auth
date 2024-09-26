"use client";

import { useState, useEffect, useCallback } from "react";
import { ActivityForm } from "./activity-form";
import { Timer } from "./timer";
import { Settings } from "./settings";
import { History } from "./history/history";
import { Activity } from "@/domain/history/types";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { db } from "@/app/lib/firebase/config";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  CollectionReference,
  DocumentReference,
} from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";

export function Pomodoro() {
  const auth = useAuth().user;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [breakTime, setBreakTime] = useState(5); // 5 minutes default
  const [timerActive, setTimerActive] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const activitiesCollection: CollectionReference | null = auth?.uid
    ? collection(db, "users", auth.uid, "activities")
    : null;

  const updateActivities = useCallback((newActivities: Activity[]) => {
    setActivities(newActivities);
    localStorage.setItem("activities", JSON.stringify(newActivities));
  }, []);

  const addActivity = async (newActivity: Activity) => {
    if (activitiesCollection) {
      try {
        const docRef = await addDoc(activitiesCollection, newActivity);
        newActivity.id = docRef.id;
      } catch (error) {
        console.error("Error adding new activity to Firestore:", error);
      }
    }
    updateActivities([...activities, newActivity]);
    if (!currentActivity && !timerActive) {
      startActivity(newActivity);
    }
  };

  const startActivity = useCallback(
    (activity: Activity) => {
      const now = new Date();
      const updatedActivity: Activity = {
        ...activity,
        status: "Em andamento",
        startDate: now.toISOString(),
      };
      setCurrentActivity(updatedActivity);
      setTimeLeft(activity.duration);
      setIsWorking(true);
      setIsRunning(true);
      setTimerActive(true);

      if (activitiesCollection && activity.id) {
        const activityRef: DocumentReference = doc(
          activitiesCollection,
          activity.id as string
        );
        updateDoc(activityRef, updatedActivity).catch((error) => {
          console.error("Error updating activity status in Firestore:", error);
        });
      }

      // Save state to localStorage
      saveStateToLocalStorage(updatedActivity, activity.duration, true, true, true);
    },
    [activitiesCollection]
  );

  const moveToNextActivity = useCallback(() => {
    const nextActivity = activities.find((a) => a.status === "Pendente");
    if (nextActivity) {
      startActivity(nextActivity);
    } else {
      setCurrentActivity(null);
      setIsRunning(false);
      setTimerActive(false);
      // Save state to localStorage
      saveStateToLocalStorage(null, 0, true, false, false);
    }
  }, [activities, startActivity]);

  const startBreak = useCallback(() => {
    setIsWorking(false);
    setTimeLeft(breakTime * 60);
    setIsRunning(true);
    setTimerActive(true);
    // Save state to localStorage
    saveStateToLocalStorage(null, breakTime * 60, false, true, true);
  }, [breakTime]);

  const finishCurrentActivity = useCallback(async () => {
    if (currentActivity) {
      const now = new Date();
      const updatedActivity: Activity = {
        ...currentActivity,
        status: "Completa",
        endDate: now.toISOString(),
      };
      const updatedActivities = activities.map((a) =>
        a.id === currentActivity.id ? updatedActivity : a
      );
      updateActivities(updatedActivities);
      setCurrentActivity(null);
      startBreak();
      if (notificationsEnabled) {
        showNotification(
          "Atividade concluída!",
          `${currentActivity.name} foi finalizada.`
        );
      }

      if (activitiesCollection && currentActivity.id) {
        const activityRef: DocumentReference = doc(
          activitiesCollection,
          currentActivity.id as string
        );
        try {
          await updateDoc(activityRef, updatedActivity);
        } catch (error) {
          console.error(
            "Error updating completed activity in Firestore:",
            error
          );
        }
      }
    }
  }, [
    activities,
    currentActivity,
    updateActivities,
    startBreak,
    notificationsEnabled,
    activitiesCollection,
  ]);

  const cancelActivity = async () => {
    if (currentActivity) {
      const now = new Date();
      const updatedActivity: Activity = {
        ...currentActivity,
        status: "Cancelada",
        endDate: now.toISOString(),
      };
      const updatedActivities = activities.map((a) =>
        a.id === currentActivity.id ? updatedActivity : a
      );
      updateActivities(updatedActivities);
      setCurrentActivity(null);
      startBreak();

      if (activitiesCollection && currentActivity.id) {
        const activityRef: DocumentReference = doc(
          activitiesCollection,
          currentActivity.id as string
        );
        try {
          await updateDoc(activityRef, updatedActivity);
        } catch (error) {
          console.error(
            "Error updating cancelled activity in Firestore:",
            error
          );
        }
      }
    }
  };

  const skipBreak = () => {
    if (!isWorking) {
      setIsWorking(true);
      moveToNextActivity();
      setTimeLeft(0);
      showNotification("Intervalo pulado", "Voltando ao trabalho.");
    }
  };

  const toggleTimer = () => {
    const newIsRunning = !isRunning;
    setIsRunning(newIsRunning);
    if (!timerActive) {
      setTimerActive(true);
    }
    // Save state to localStorage
    saveStateToLocalStorage(currentActivity, timeLeft, isWorking, newIsRunning, true);
  };

  const showNotification = (title: string, body: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  const saveStateToLocalStorage = (
    activity: Activity | null,
    time: number,
    working: boolean,
    running: boolean,
    active: boolean
  ) => {
    const state = {
      currentActivity: activity,
      timeLeft: time,
      isWorking: working,
      isRunning: running,
      timerActive: active,
      lastUpdated: new Date().getTime(),
    };
    localStorage.setItem("pomodoroState", JSON.stringify(state));
  };

  useEffect(() => {
    const storedActivities = localStorage.getItem("activities");
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    }

    const storedState = localStorage.getItem("pomodoroState");
    if (storedState) {
      const state = JSON.parse(storedState);
      const timePassed = (new Date().getTime() - state.lastUpdated) / 1000;
      const updatedTimeLeft = Math.max(0, state.timeLeft - (state.isRunning ? Math.floor(timePassed) : 0));

      setCurrentActivity(state.currentActivity);
      setTimeLeft(updatedTimeLeft);
      setIsWorking(state.isWorking);
      setIsRunning(state.isRunning);
      setTimerActive(state.timerActive);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          // Save state to localStorage every second
          saveStateToLocalStorage(currentActivity, newTime, isWorking, isRunning, timerActive);
          return newTime;
        });
        if (currentActivity) {
          setCurrentActivity((activity) =>
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
        if (notificationsEnabled) {
          showNotification(
            "Intervalo finalizado!",
            "Hora de voltar ao trabalho!"
          );
        }
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
    notificationsEnabled,
  ]);

  return (
    <div className=" w-full grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
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
      <History />
    </div>
  );
}