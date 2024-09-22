'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Activity = {
  id: number
  name: string
  duration: number
  completed: boolean
  timestamp: number
}

type PomodoroContextType = {
  currentActivity: Activity | null
  activities: Activity[]
  setCurrentActivity: (activity: Activity | null) => void
  addActivity: (activity: Activity) => void
  completeActivity: (id: number) => void
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined)

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const storedActivities = localStorage.getItem('pomodoroActivities')
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('pomodoroActivities', JSON.stringify(activities))
  }, [activities])

  const addActivity = (activity: Activity) => {
    setActivities((prevActivities) => [...prevActivities, activity])
  }

  const completeActivity = (id: number) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id ? { ...activity, completed: true } : activity
      )
    )
  }

  return (
    <PomodoroContext.Provider
      value={{
        currentActivity,
        activities,
        setCurrentActivity,
        addActivity,
        completeActivity,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  )
}

export const usePomodoroContext = () => {
  const context = useContext(PomodoroContext)
  if (context === undefined) {
    throw new Error('usePomodoroContext must be used within a PomodoroProvider')
  }
  return context
}