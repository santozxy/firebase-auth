import { Activity } from "@/domain/history/types";
import { toast } from "@/hooks/use-toast";



export const saveStateToLocalStorage = (
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

export const showNotificationOrToast = (title: string, body: string) => {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else {
    toast({ title, description: body });
  }
};
