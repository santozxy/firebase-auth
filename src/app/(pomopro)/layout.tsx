import { Header } from "./components/header/header";
import { PomodoroProvider } from "@/context/pomodoro-context";

export default async function LayoutPomoPro({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="p-10 max-sm:p-6">
        <PomodoroProvider>{children}</PomodoroProvider>
      </main>
    </div>
  );
}
