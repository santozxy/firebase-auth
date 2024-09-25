// app/page.tsx
import { Metadata } from "next";
import { Pomodoro } from "./components/pomodoro/pomodoro";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <main>
      <Pomodoro />
    </main>
  );
}
