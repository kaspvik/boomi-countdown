import type { User } from "firebase/auth";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "../firebase";

let currentUserPromise: Promise<User> | null = null;

export function ensureSignedIn(): Promise<User> {
  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }

  if (currentUserPromise) {
    return currentUserPromise;
  }

  currentUserPromise = new Promise<User>((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        unsubscribe();
        resolve(user);
        return;
      }

      try {
        const cred = await signInAnonymously(auth);
        unsubscribe();
        resolve(cred.user);
      } catch (err) {
        unsubscribe();
        reject(err);
      }
    });
  });

  return currentUserPromise;
}
