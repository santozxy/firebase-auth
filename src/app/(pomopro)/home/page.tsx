// app/page.tsx
import { Metadata } from "next";
import { Pomodoro } from "./components/pomodoro/pomodoro";
import { Queue } from "./components/queue/queue";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  return (
    <main className="w-full grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
      <Pomodoro />
      <Queue />
    </main>
  );
}
