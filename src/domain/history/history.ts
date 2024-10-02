import { ActivityWithId } from "@/app/(pomopro)/history/components/activity-history/activity-history";
import { db } from "@/app/lib/firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { unstable_cache } from "next/cache";

async function getHistoryActivity(uuid: string) {
  const q = query(
    collection(db, "users", uuid, "activities"),
    orderBy("startDate", "desc")
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return [];
  }
  const activitys = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return activitys as ActivityWithId[];
}

export const getHistoryActivityCached = unstable_cache(
  /* fetch function */ getHistoryActivity,
  /* unique key     */ ["getHistoryActivity"],
  /* options        */ {
    tags: ["getHistoryActivity"],
    revalidate: 60 + 60 * 60,
  }
);
