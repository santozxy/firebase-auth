import { useState, useEffect } from "react";
import { auth, db } from "@/app/lib/firebase/config";
import { collection, CollectionReference } from "firebase/firestore";

export function useCollection() {
  const [activitiesCollection, setActivitiesCollection] =
    useState<CollectionReference | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setActivitiesCollection(
          collection(db, "users", user.uid, "activities")
        );
      }
    });

    return () => unsubscribe();
  }, []);

  return { activitiesCollection };
}


