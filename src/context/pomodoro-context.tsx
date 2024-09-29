"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Activity } from "@/domain/history/types";
import {
  addDoc,
  doc,
  updateDoc,
  DocumentReference,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { showNotificationOrToast } from "@/utils/pomodoro";
import { useCollection } from "@/hooks/use-collections";
import { formatTime } from "@/utils/date-format";

interface PomodoroContextType {
  currentActivity: Activity | null;
  timeLeft: number;
  isWorking: boolean;
  isRunning: boolean;
  timerActive: boolean;
  dialogShown: boolean;
  activities: Activity[];
  breakTime: number;
  inProgressActivity: Activity | null;
  showDialog: boolean;
  tickingEnabled: boolean;
  addActivity: (newActivity: Activity) => Promise<void>;
  startActivity: (activity: Activity) => void;
  moveToNextActivity: () => void;
  startBreak: () => void;
  finishCurrentActivity: () => Promise<void>;
  cancelActivity: () => Promise<void>;
  skipBreak: () => void;
  toggleTimer: () => void;
  setBreakTime: (time: number) => void;
  handleResumeActivity: () => void;
  handleDeleteActivity: () => Promise<void>;
  setShowDialog: (show: boolean) => void;
  setTickingEnabled: (enabled: boolean) => void;
  toggleTicking: () => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(
  undefined
);

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { activitiesCollection } = useCollection();
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isWorking, setIsWorking] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [dialogShown, setDialogShown] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [breakTime, setBreakTime] = useState(5);
  const [inProgressActivity, setInProgressActivity] = useState<Activity | null>(
    null
  );
  const [showDialog, setShowDialog] = useState(false);
  const [tickingEnabled, setTickingEnabled] = useState(true);
  const activityCompleteAudioRef = useRef<HTMLAudioElement | null>(null);
  const breakCompleteAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    audioRef.current = new Audio("/clock.mp3");
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && tickingEnabled && audioRef.current) {
      const playTick = () => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      };

      intervalRef.current = setInterval(playTick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, tickingEnabled]);

  const toggleTicking = () => {
    setTickingEnabled((prev) => !prev);
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
          activity.id as string
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
      document.title = "Home | Pomopro";
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

      startBreak();
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
  };

  const playSound = (type: "activity" | "break") => {
    if (type === "activity" && activityCompleteAudioRef.current) {
      activityCompleteAudioRef.current.play();
    } else if (type === "break" && breakCompleteAudioRef.current) {
      breakCompleteAudioRef.current.play();
    }
  };

  const checkForPendingActivities = useCallback(async () => {
    if (!activitiesCollection) return;
    const q = query(activitiesCollection, where("status", "==", "Pendente"));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const pendingActivity = querySnapshot.docs[0];
      setInProgressActivity({
        ...pendingActivity.data(),
        id: pendingActivity.id,
      } as unknown as Activity);
      setShowDialog(true);
      setDialogShown(true);
    }
  }, [activitiesCollection]);

  const checkForInProgressActivities = useCallback(async () => {
    if (!activitiesCollection || dialogShown) return;

    const q = query(
      activitiesCollection,
      where("status", "==", "Em andamento")
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const inProgressActivity = querySnapshot.docs[0];
      setInProgressActivity({
        ...inProgressActivity.data(),
        id: inProgressActivity.id,
      } as unknown as Activity);
      setShowDialog(true);
      setDialogShown(true);
    } else {
      await checkForPendingActivities();
    }
  }, [activitiesCollection, checkForPendingActivities, dialogShown]);

  const handleResumeActivity = () => {
    if (inProgressActivity) {
      startActivity(inProgressActivity);
    }
    setShowDialog(false);
  };

  const handleDeleteActivity = async () => {
    if (inProgressActivity && inProgressActivity.id && activitiesCollection) {
      try {
        await deleteDoc(
          doc(activitiesCollection, inProgressActivity.id as string)
        );
        const updatedActivities = activities.filter(
          (a) => a.id !== inProgressActivity.id
        );
        updateActivities(updatedActivities);
        checkForPendingActivities();
      } catch (error) {
        console.error("Error deleting activity from Firestore:", error);
      }
    }
    setShowDialog(false);
  };

  useEffect(() => {
    checkForInProgressActivities();
  }, [checkForInProgressActivities]);

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
          document.title = `${formatTime(time - 1)} - Pomopro`;
          const newTime = time - 1;
          return newTime;
        });
        if (currentActivity) {
          setCurrentActivity((activity) => {
            if (activity) {
              return {
                ...activity,
                timeWorked: (activity.timeWorked || 0) + 1,
              };
            }
            return activity;
          });
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
  ]);

  return (
    <PomodoroContext.Provider
      value={{
        currentActivity,
        timeLeft,
        isWorking,
        isRunning,
        timerActive,
        dialogShown,
        activities,
        breakTime,
        inProgressActivity,
        showDialog,
        tickingEnabled,
        addActivity,
        startActivity,
        moveToNextActivity,
        startBreak,
        finishCurrentActivity,
        cancelActivity,
        skipBreak,
        toggleTimer,
        setBreakTime,
        handleResumeActivity,
        handleDeleteActivity,
        setShowDialog,
        setTickingEnabled,
        toggleTicking,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoroContext = () => {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error(
      "usePomodoroContext must be used within a PomodoroProvider"
    );
  }
  return context;
};
