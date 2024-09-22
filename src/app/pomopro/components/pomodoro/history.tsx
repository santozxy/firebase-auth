"use client";

import React from "react";
import { usePomodoroContext } from "@/context/pomodoro-context";

export function History() {
  const { activities } = usePomodoroContext();

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Histórico de Atividades</h2>
      <ul className="space-y-2">
        {activities.map((activity) => (
          <li key={activity.id} className="bg-gray-100 p-4 rounded-md">
            <div className="font-bold">{activity.name}</div>
            <div>Duração: {activity.duration} minutos</div>
            <div>Status: {activity.completed ? "Concluída" : "Pendente"}</div>
            <div>Data: {new Date(activity.timestamp).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
