"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ActivityForm } from "./activity-form";
import { Timer } from "./timer";
import { Settings } from "./settings";
import { History } from "./history/history";
import { Activity } from "@/domain/history/types";
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
import { toast } from "@/hooks/use-toast";

export function Pomodoro() {
  const auth = useAuth().user;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [breakTime, setBreakTime] = useState(5); // 5 minutes default
  const [timerActive, setTimerActive] = useState(false);
  const activitiesCollection: CollectionReference | null = auth?.uid
    ? collection(db, "users", auth.uid, "activities")
    : null;

  const activityCompleteAudioRef = useRef<HTMLAudioElement | null>(null);
  const breakCompleteAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    activityCompleteAudioRef.current = new Audio("/activity-complete.mp3");
    breakCompleteAudioRef.current = new Audio("/break-complete.mp3");

    return () => {
      if (activityCompleteAudioRef.current) {
        activityCompleteAudioRef.current = null;
      }
      if (breakCompleteAudioRef.current) {
        breakCompleteAudioRef.current = null;
      }
    };
  }, []);

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

      saveStateToLocalStorage(
        updatedActivity,
        activity.duration,
        true,
        true,
        true
      );
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
      saveStateToLocalStorage(null, 0, true, false, false);
    }
  }, [activities, startActivity]);

  const startBreak = useCallback(() => {
    setIsWorking(false);
    setTimeLeft(breakTime * 60);
    setIsRunning(true);
    setTimerActive(true);
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
      playSound('activity');
      showNotificationOrToast(
        "Atividade concluída!",
        `${currentActivity.name} foi finalizada.`
      );

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
    }
  };

  const toggleTimer = () => {
    const newIsRunning = !isRunning;
    setIsRunning(newIsRunning);
    if (!timerActive) {
      setTimerActive(true);
    }
    saveStateToLocalStorage(
      currentActivity,
      timeLeft,
      isWorking,
      newIsRunning,
      true
    );
  };

  const playSound = (type: 'activity' | 'break') => {
    if (type === 'activity' && activityCompleteAudioRef.current) {
      activityCompleteAudioRef.current.play();
    } else if (type === 'break' && breakCompleteAudioRef.current) {
      breakCompleteAudioRef.current.play();
    }
  };

  const showNotificationOrToast = (title: string, body: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else {
      toast({ title, description: body });
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
      const updatedTimeLeft = Math.max(
        0,
        state.timeLeft - (state.isRunning ? Math.floor(timePassed) : 0)
      );

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
          saveStateToLocalStorage(
            currentActivity,
            newTime,
            isWorking,
            isRunning,
            timerActive
          );
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
        playSound('break');
        showNotificationOrToast(
          "Intervalo finalizado!",
          "Hora de voltar ao trabalho!"
        );
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isWorking, currentActivity, finishCurrentActivity, moveToNextActivity, timerActive]);

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
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