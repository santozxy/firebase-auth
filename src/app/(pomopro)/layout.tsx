import { redirect } from "next/navigation";
import { getCurrentUser } from "../lib/firebase/admin";
import { Header } from "./components/header/header";
import { PomodoroProvider } from "@/context/pomodoro-context";

export default async function LayoutPomoPro({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");
  return (
    <div>
      <Header />
      <main className="p-8">
        <PomodoroProvider>{children}</PomodoroProvider>
      </main>
    </div>
  );
}
