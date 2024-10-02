import React from "react";
import { ActivityHistory } from "./components/activity-history/activity-history";
import { getHistoryActivityCached } from "@/domain/history/history";
import { getCurrentUser } from "@/app/lib/firebase/admin";

export default async function History() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;
  const historyActivity = await getHistoryActivityCached(currentUser.uid);
  return (
    <main>
      <ActivityHistory activities={historyActivity} />
    </main>
  );
}
