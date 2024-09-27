"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ActivityForm } from "./activity-form";
import { Timer } from "./timer";
import { Settings } from "./settings";
import { Activity } from "@/domain/history/types";
import {
  addDoc,
  doc,
  updateDoc,
  DocumentReference,
  deleteDoc,
} from "firebase/firestore";
import { saveStateToLocalStorage, showNotificationOrToast } from "./helpers";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useCollection } from "@/hooks/use-collections";

export function Pomodoro() {
  const { activitiesCollection } = useCollection();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [breakTime, setBreakTime] = useState(5); // 5 minutes default
  const [timerActive, setTimerActive] = useState(false);
  const [inProgressActivity, setInProgressActivity] = useState<Activity | null>(
    null
  );
  const [showDialog, setShowDialog] = useState(false);
  const activityCompleteAudioRef = useRef<HTMLAudioElement | null>(null);
  const breakCompleteAudioRef = useRef<HTMLAudioElement | null>(null);

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
      playSound("activity");
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
      const updatedActivities = activities.map((item) =>
        item.id === currentActivity.id ? updatedActivity : item
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
      setTimeLeft(0);
      moveToNextActivity();
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

  const playSound = (type: "activity" | "break") => {
    if (type === "activity" && activityCompleteAudioRef.current) {
      activityCompleteAudioRef.current.play();
    } else if (type === "break" && breakCompleteAudioRef.current) {
      breakCompleteAudioRef.current.play();
    }
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

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          const minutes = Math.floor(newTime / 60);
          const seconds = newTime % 60;

          document.title =
            `${minutes < 10 ? "0" : ""}${minutes}:${
              seconds < 10 ? "0" : ""
            }${seconds}` + " - Pomopro";
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
        playSound("break");
        showNotificationOrToast(
          "Intervalo finalizado!",
          "Hora de voltar ao trabalho!"
        );
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
    timerActive,
  ]);

  // ... (mantenha as outras funções)

  const checkForInProgressActivities = useCallback(() => {
    const inProgress = activities.find((a) => a.status === "Em andamento");
    if (inProgress && !currentActivity && !timerActive) {
      setInProgressActivity(inProgress);
      setShowDialog(true);
    }
  }, [activities, currentActivity, timerActive]);

  const handleResumeActivity = () => {
    if (inProgressActivity) {
      startActivity(inProgressActivity);
    }
    setShowDialog(false);
  };

  const handleDeleteActivity = async () => {
    if (inProgressActivity && inProgressActivity.id && activitiesCollection) {
      try {
        if (inProgressActivity.id) {
          await deleteDoc(
            doc(activitiesCollection, inProgressActivity.id as string)
          );
        }
        const updatedActivities = activities.filter(
          (a) => a.id !== inProgressActivity.id
        );
        updateActivities(updatedActivities);
      } catch (error) {
        console.error("Error deleting activity from Firestore:", error);
      }
    }
    setShowDialog(false);
  };

  useEffect(() => {
    checkForInProgressActivities();
  }, [checkForInProgressActivities]);

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
        onCancelActivity={cancelActivity}
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
    </div>
  );
}
