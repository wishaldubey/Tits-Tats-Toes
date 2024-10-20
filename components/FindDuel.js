import { useEffect, useState } from "react";
import { collection, addDoc, doc, onSnapshot, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useRouter } from "next/router";

export default function FindDuel() {
  const [waiting, setWaiting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const matchmakingRef = collection(db, "matchmaking");
    let unsubscribe;

    if (waiting) {
      unsubscribe = onSnapshot(matchmakingRef, async (snapshot) => {
        if (!snapshot.empty) {
          const match = snapshot.docs[0];
          const docRef = await addDoc(collection(db, "games"), {
            board: Array(9).fill(null),
            currentPlayer: "X",
            players: [],
            winner: null,
          });

          await deleteDoc(doc(db, "matchmaking", match.id));
          router.push(`/game/${docRef.id}`);
        }
      });
    }

    return () => unsubscribe && unsubscribe();
  }, [waiting]);

  const findDuel = async () => {
    setWaiting(true);
    const docRef = await addDoc(collection(db, "matchmaking"), { status: "waiting" });

    return () => {
      setWaiting(false);
      deleteDoc(docRef);
    };
  };

  return (
    <button
      className="bg-purple-500 text-white py-2 px-4 rounded"
      onClick={findDuel}
      disabled={waiting}
    >
      {waiting ? "Waiting for opponent..." : "Find Duel"}
    </button>
  );
}
