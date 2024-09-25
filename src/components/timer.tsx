"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export function PomodoroTimer() {
  const [time, setTime] = useState(60); // 1 minute in seconds
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const resetTimer = () => {
    setIsActive(true);
    setTime(60);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96">
      <svg className="w-full h-full animate-pulse" viewBox="0 0 100 100">
        <circle
          className="text-primary/20"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r="48"
          cx="50"
          cy="50"
        />
        <motion.circle
          className="text-primary"
          strokeWidth="4"
          stroke="currentColor"
          fill="transparent"
          r="48"
          cx="50"
          cy="50"
          initial={{ strokeDasharray: "0 301.59" }}
          animate={{
            strokeDasharray: `${301.59 * (1 - time / 60)} 301.59`,
          }}
          transition={{ duration: 1 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-mono font-bold text-primary mb-4">
          {formatTime(time)}
        </h1>
        <Button size="icon" onClick={resetTimer} aria-label="Reset timer">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
