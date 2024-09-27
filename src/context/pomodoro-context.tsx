'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { Activity } from "@/domain/history/types"
import { saveStateToLocalStorage } from "@/utils/pomodoro"

interface PomodoroContextType {
  currentActivity: Activity | null
  timeLeft: number
  isWorking: boolean
  isRunning: boolean
  timerActive: boolean
  dialogShown: boolean
  setCurrentActivity: React.Dispatch<React.SetStateAction<Activity | null>>
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>
  setIsWorking: (isWorking: boolean) => void
  setIsRunning: (isRunning: boolean) => void
  setTimerActive: (active: boolean) => void
  setDialogShown: (shown: boolean) => void
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined)

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isWorking, setIsWorking] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const [dialogShown, setDialogShown] = useState(false)

  const updateTitle = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    document.title = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds} - Pomopro`
  }, [timeLeft])

  useEffect(() => {
    const savedState = localStorage.getItem("pomodoroState")
    if (savedState) {
      const { currentActivity, timeLeft, isWorking, isRunning, timerActive, dialogShown } = JSON.parse(savedState)
      setCurrentActivity(currentActivity)
      setTimeLeft(timeLeft)
      setIsWorking(isWorking)
      setIsRunning(isRunning)
      setTimerActive(timerActive)
      setDialogShown(dialogShown)
    }
  }, [])

  useEffect(() => {
    saveStateToLocalStorage(currentActivity, timeLeft, isWorking, isRunning, timerActive)
    localStorage.setItem("dialogShown", JSON.stringify(dialogShown))
    updateTitle()
  }, [currentActivity, timeLeft, isWorking, isRunning, timerActive, dialogShown, updateTitle])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1
          saveStateToLocalStorage(currentActivity, newTime, isWorking, isRunning, timerActive)
          updateTitle()
          return newTime
        })
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      setTimerActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, currentActivity, isWorking, timerActive, updateTitle])

  return (
    <PomodoroContext.Provider
      value={{
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
      }}
    >
      {children}
    </PomodoroContext.Provider>
  )
}

export const usePomodoroContext = () => {
  const context = useContext(PomodoroContext)
  if (context === undefined) {
    throw new Error("usePomodoroContext must be used within a PomodoroProvider")
  }
  return context
}