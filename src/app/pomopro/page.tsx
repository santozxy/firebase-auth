import { PomodoroProvider } from "@/context/pomodoro-context";
import { RegisterTask } from "./components/pomodoro/form";
import { Timer } from "./components/pomodoro/timer";
import { History } from "./components/pomodoro/history";

export default function Home() {
  return (
    <PomodoroProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Pomodoro App</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Nova Atividade</h2>
            <RegisterTask />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Timer</h2>
            <Timer />
          </div>
        </div>
        <History />
      </div>
    </PomodoroProvider>
  );
}
