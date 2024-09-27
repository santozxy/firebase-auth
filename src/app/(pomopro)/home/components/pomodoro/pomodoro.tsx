'use client'

import { useState, useEffect, useCallback, useRef } from "react"
import { ActivityForm } from "./activity-form"
import { Timer } from "./timer"
import { Settings } from "./settings"
import { Activity } from "@/domain/history/types"
import {
  addDoc,
  doc,
  updateDoc,
  DocumentReference,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore"
import { showNotificationOrToast } from "./helpers"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { useCollection } from "@/hooks/use-collections"
import { usePomodoroContext } from "@/context/pomodoro-context"

export function Pomodoro() {
  const { activitiesCollection } = useCollection()
  const [activities, setActivities] = useState<Activity[]>([])
  const [breakTime, setBreakTime] = useState(5)
  const [inProgressActivity, setInProgressActivity] = useState<Activity | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const activityCompleteAudioRef = useRef<HTMLAudioElement | null>(null)
  const breakCompleteAudioRef = useRef<HTMLAudioElement | null>(null)

  const {
    currentActivity,
    timeLeft,
    isWorking,
    isRunning,
    timerActive,
    dialogShown,
    setCurrentActivity,
    setTimeLeft,
    setIsWorking,
    setIsRunning,
    setTimerActive,
    setDialogShown,
  } = usePomodoroContext()

  const updateActivities = useCallback((newActivities: Activity[]) => {
    setActivities(newActivities)
    localStorage.setItem("activities", JSON.stringify(newActivities))
  }, [])

  const addActivity = async (newActivity: Activity) => {
    if (activitiesCollection) {
      try {
        const docRef = await addDoc(activitiesCollection, newActivity)
        newActivity.id = docRef.id
      } catch (error) {
        console.error("Error adding new activity to Firestore:", error)
      }
    }
    updateActivities([...activities, newActivity])
    if (!currentActivity && !timerActive) {
      startActivity(newActivity)
    }
  }

  const startActivity = useCallback(
    (activity: Activity) => {
      const now = new Date()
      const updatedActivity: Activity = {
        ...activity,
        status: "Em andamento",
        startDate: now.toISOString(),
      }
      setCurrentActivity(updatedActivity)
      setTimeLeft(activity.duration)
      setIsWorking(true)
      setIsRunning(true)
      setTimerActive(true)

      if (activitiesCollection && activity.id) {
        const activityRef: DocumentReference = doc(
          activitiesCollection,
          activity.id as string
        )
        updateDoc(activityRef, updatedActivity).catch((error) => {
          console.error("Error updating activity status in Firestore:", error)
        })
      }
    },
    [activitiesCollection, setCurrentActivity, setTimeLeft, setIsWorking, setIsRunning, setTimerActive]
  )

  const moveToNextActivity = useCallback(() => {
    const nextActivity = activities.find((a) => a.status === "Pendente")
    if (nextActivity) {
      startActivity(nextActivity)
    } else {
      setCurrentActivity(null)
      setIsRunning(false)
      setTimerActive(false)
    }
  }, [activities, startActivity, setCurrentActivity, setIsRunning, setTimerActive])

  const startBreak = useCallback(() => {
    setIsWorking(false)
    setTimeLeft(breakTime * 60)
    setIsRunning(true)
    setTimerActive(true)
  }, [breakTime, setIsWorking, setTimeLeft, setIsRunning, setTimerActive])

  const finishCurrentActivity = useCallback(async () => {
    if (currentActivity) {
      const now = new Date()
      const updatedActivity: Activity = {
        ...currentActivity,
        status: "Completa",
        endDate: now.toISOString(),
      }
      console.log("currentActivity", currentActivity)
      const updatedActivities = activities.map((a) =>
        a.id === currentActivity.id ? updatedActivity : a
      )
      updateActivities(updatedActivities)
      setCurrentActivity(null)
      playSound("activity")
      showNotificationOrToast(
        "Atividade concluída!",
        `${currentActivity.name} foi finalizada.`
      )

      if (activitiesCollection && currentActivity.id) {
        console.log("Entrou aqui")
        const activityRef: DocumentReference = doc(
          activitiesCollection,
          currentActivity.id as string
        )
        try {
          await updateDoc(activityRef, updatedActivity)
        } catch (error) {
          console.error(
            "Error updating completed activity in Firestore:",
            error
          )
        }
      }

      // Iniciar o descanso automaticamente após a conclusão da atividade
      startBreak()
    }
  }, [activities, currentActivity, updateActivities, startBreak, activitiesCollection, setCurrentActivity])

  const cancelActivity = async () => {
    if (currentActivity) {
      const now = new Date()
      const updatedActivity: Activity = {
        ...currentActivity,
        status: "Cancelada",
        endDate: now.toISOString(),
      }
      const updatedActivities = activities.map((item) =>
        item.id === currentActivity.id ? updatedActivity : item
      )
      updateActivities(updatedActivities)
      setCurrentActivity(null)
      startBreak()

      if (activitiesCollection && currentActivity.id) {
        const activityRef: DocumentReference = doc(
          activitiesCollection,
          currentActivity.id as string
        )
        try {
          await updateDoc(activityRef, updatedActivity)
        } catch (error) {
          console.error(
            "Error updating cancelled activity in Firestore:",
            error
          )
        }
      }
    }
  }

  const skipBreak = () => {
    if (!isWorking) {
      setIsWorking(true)
      setTimeLeft(0)
      moveToNextActivity()
    }
  }

  const toggleTimer = () => {
    const newIsRunning = !isRunning
    setIsRunning(newIsRunning)
    if (!timerActive) {
      setTimerActive(true)
    }
  }

  const playSound = (type: "activity" | "break") => {
    if (type === "activity" && activityCompleteAudioRef.current) {
      activityCompleteAudioRef.current.play()
    } else if (type === "break" && breakCompleteAudioRef.current) {
      breakCompleteAudioRef.current.play()
    }
  }

  const checkForPendingActivities = useCallback(async () => {
    if (!activitiesCollection) return
    const q = query(activitiesCollection, where("status", "==", "Pendente"))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const pendingActivity = querySnapshot.docs[0]
      setInProgressActivity({
        ...pendingActivity.data(),
        id: pendingActivity.id,
      } as unknown as Activity)
      setShowDialog(true)
      setDialogShown(true)
    }
  }, [activitiesCollection, setDialogShown])

  const checkForInProgressActivities = useCallback(async () => {
    if (!activitiesCollection || dialogShown) return

    const q = query(
      activitiesCollection,
      where("status", "==", "Em andamento")
    )
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const inProgressActivity = querySnapshot.docs[0]
      setInProgressActivity({
        ...inProgressActivity.data(),
        id: inProgressActivity.id,
      } as unknown as Activity)
      setShowDialog(true)
      setDialogShown(true)
    } else {
      await checkForPendingActivities()
    }
  }, [
    activitiesCollection,
    checkForPendingActivities,
    dialogShown,
    setDialogShown,
  ])

  const handleResumeActivity = () => {
    if (inProgressActivity) {
      startActivity(inProgressActivity)
    }
    setShowDialog(false)
  }

  const handleDeleteActivity = async () => {
    if (inProgressActivity && inProgressActivity.id && activitiesCollection) {
      try {
        await deleteDoc(
          doc(activitiesCollection, inProgressActivity.id as string)
        )
        const updatedActivities = activities.filter(
          (a) => a.id !== inProgressActivity.id
        )
        updateActivities(updatedActivities)
        checkForPendingActivities()
      } catch (error) {
        console.error("Error deleting activity from Firestore:", error)
      }
    }
    setShowDialog(false)
  }

  useEffect(() => {
    checkForInProgressActivities()
  }, [checkForInProgressActivities])

  useEffect(() => {
    activityCompleteAudioRef.current = new Audio("/activity-complete.mp3")
    breakCompleteAudioRef.current = new Audio("/break-complete.mp3")

    return () => {
      if (activityCompleteAudioRef.current) {
        activityCompleteAudioRef.current = null
      }
      if (breakCompleteAudioRef.current) {
        breakCompleteAudioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1
          return newTime
        })
        if (currentActivity) {
          setCurrentActivity((activity) => {
            if (activity) {
              return {
                ...activity,
                timeWorked: (activity.timeWorked || 0) + 1,
              }
            }
            return activity
          })
        }
      }, 1000)
    } else if (timeLeft === 0) {
      if (isWorking) {
        finishCurrentActivity()
      } else {
        setIsWorking(true)
        moveToNextActivity()
        playSound("break")
        showNotificationOrToast(
          "Intervalo finalizado!",
          "Hora de voltar ao trabalho!"
        )
      }
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [
    isRunning,
    timeLeft,
    isWorking,
    currentActivity,
    finishCurrentActivity,
    moveToNextActivity,
    setTimeLeft,
    setCurrentActivity,
    setIsWorking,
  ])

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
  )
}