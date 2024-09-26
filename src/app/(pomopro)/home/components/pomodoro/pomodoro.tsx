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
import { NotificationPermission } from "./notification-permission";

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

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "default") {
        setShowNotificationModal(true);
      } else if (permission === "granted") {
        setNotificationsEnabled(true);
      }
    };

    checkNotificationPermission();
  }, []);

  const handleRequestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotificationsEnabled(true);
    }
    setShowNotificationModal(false);
  };

  const handleDismissPermission = () => {
    setShowNotificationModal(false);
  };

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
          activity.id
        );
        updateDoc(activityRef, updatedActivity).catch((error) => {
          console.error("Error updating activity status in Firestore:", error);
        });
      }
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
    }
  }, [activities, startActivity]);

  const startBreak = useCallback(() => {
    setIsWorking(false);
    setTimeLeft(breakTime * 60);
    setIsRunning(true);
    setTimerActive(true);
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
          currentActivity.id
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
          currentActivity.id
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
    setIsRunning(!isRunning);
    if (!timerActive) {
      setTimerActive(true);
    }
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  const showNotification = (title: string, body: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
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
    <div className="p-4 w-full grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">PomoPro</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleNotifications}
            title={
              notificationsEnabled
                ? "Desativar notificações"
                : "Ativar notificações"
            }
          >
            {notificationsEnabled ? (
              <Bell className="h-4 w-4" />
            ) : (
              <BellOff className="h-4 w-4 animate-pulse duration-700" />
            )}
          </Button>
        </div>
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
      {showNotificationModal && (
        <NotificationPermission
          onRequestPermission={handleRequestPermission}
          onDismiss={handleDismissPermission}
        />
      )}
    </div>
  );
}
