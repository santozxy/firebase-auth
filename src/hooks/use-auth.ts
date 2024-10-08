import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { auth, db } from "@/app/lib/firebase/config";
import { collection, CollectionReference } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [uuid, setUuid] = useState<string | null>(null);
  const [activitiesCollection, setActivitiesCollection] =
    useState<CollectionReference | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        setUuid(user.uid);
        setActivitiesCollection(
          collection(db, "users", user.uid, "activities")
        );
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, uuid, activitiesCollection };
}
