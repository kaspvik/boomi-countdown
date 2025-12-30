import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useRef } from "react";
import { db } from "../firebase";
import type { Room } from "../types/game";

export function useHostPhaseController(params: {
  room: Room | null;
  roomId: string;
  gameStarted: boolean;
  isHost: boolean;
  allAliveVoted: boolean;
  votesCount: number;
  votesLoaded: boolean;
}) {
  const {
    room,
    roomId,
    gameStarted,
    isHost,
    allAliveVoted,
    votesCount,
    votesLoaded,
  } = params;

  const sentQuestionResultsRef = useRef<string | null>(null);
  const resetNoVotesRef = useRef<string | null>(null);

  useEffect(() => {
    if (!room || !gameStarted || !isHost) return;
    if (!votesLoaded) return;
    if (room.phase !== "question_results") return;
    if (room.round <= 1) return;
    if (votesCount !== 0) return;

    const key = `${roomId}:${room.round}:resetNoVotes`;
    if (resetNoVotesRef.current === key) return;
    resetNoVotesRef.current = key;

    const roomRef = doc(db, "rooms", roomId);

    (async () => {
      try {
        await updateDoc(roomRef, { phase: "question" });
      } catch (err) {
        console.error("Failed to reset phase to question", err);
      }
    })();
  }, [roomId, room, gameStarted, isHost, votesCount, votesLoaded]);

  useEffect(() => {
    if (!room || !gameStarted || !isHost) return;
    if (!votesLoaded) return;
    if (room.phase !== "question") return;
    if (!allAliveVoted) return;

    const key = `${roomId}:${room.round}:toQuestionResults`;
    if (sentQuestionResultsRef.current === key) return;
    sentQuestionResultsRef.current = key;

    const roomRef = doc(db, "rooms", roomId);

    (async () => {
      try {
        await updateDoc(roomRef, { phase: "question_results" });
      } catch (err) {
        console.error("Failed to set phase=question_results", err);
      }
    })();
  }, [roomId, room, gameStarted, isHost, allAliveVoted, votesLoaded]);
}
