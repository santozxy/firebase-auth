// app/page.tsx
import { Metadata } from "next";
import { Pomodoro } from "./components/pomodoro/pomodoro";
import { getCurrentUser } from "@/app/lib/firebase/admin";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");
  return (
    <main>
      <Pomodoro />
    </main>
  );
}
