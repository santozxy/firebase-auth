"use client";

import React, { useState } from "react";
import { usePomodoroContext } from "@/context/pomodoro-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterTask() {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const { addActivity, setCurrentActivity } = usePomodoroContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && duration) {
      const newActivity = {
        id: Date.now(),
        name,
        duration: parseInt(duration),
        completed: false,
        timestamp: Date.now(),
      };
      addActivity(newActivity);
      setCurrentActivity(newActivity);
      setName("");
      setDuration("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome da Atividade</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="duration">Duração (minutos)</Label>
        <Input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          min="1"
        />
      </div>
      <Button type="submit">Iniciar Atividade</Button>
    </form>
  );
}
