// In @/app/lib/firebase/activities.ts

import {
  query,
  where,
  getDocs,
  deleteDoc,
  CollectionReference,
} from "firebase/firestore";

export async function deleteInProgressAndPendingActivities(
  activitiesCollection: CollectionReference
) {
  const q = query(
    activitiesCollection,
    where("status", "in", ["Em andamento", "Pendente"])
  );

  try {
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log("All in-progress and pending activities deleted successfully");
  } catch (error) {
    console.error("Error deleting activities:", error);
  }
}
