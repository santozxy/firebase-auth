import { Activity } from "@/domain/history/types";
import { toast } from "@/hooks/use-toast";

export const saveStateToLocalStorage = (
  currentActivity: Activity | null,
  timeLeft: number,
  isWorking: boolean,
  isRunning: boolean,
  timerActive: boolean,
  tickingEnabled: boolean,
  activities: Activity[],
  breakTime: number
) => {
  localStorage.setItem(
    "pomodoroState",
    JSON.stringify({
      currentActivity,
      timeLeft,
      isWorking,
      isRunning,
      timerActive,
      tickingEnabled,
      activities,
      breakTime,
    })
  );
};

export const showNotificationOrToast = (title: string, body: string) => {
  const notificationEnabled = localStorage.getItem("notificationsEnabled");
  if (notificationEnabled === "true") {
    new Notification(title, { body });
  } else {
    toast({ title, description: body });
  }
};
