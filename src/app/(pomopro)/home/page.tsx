// app/page.tsx
import { Metadata } from "next";
import { Pomodoro } from "./components/pomodoro/pomodoro";

export const metadata: Metadata = {
  title: "Home",
}

export default function Home() {
  return (
    <main className="h-screen bg-gray-100 p-5">
      <Pomodoro />
    </main>
  );
}
