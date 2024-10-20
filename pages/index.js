import { useState } from "react";
import { useRouter } from "next/router";
import { db } from "../lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import FindDuel from "../components/FindDuel";

export default function Home() {
  const [gameId, setGameId] = useState("");
  const router = useRouter();

  const createGame = async () => {
    const docRef = await addDoc(collection(db, "games"), {
      board: Array(9).fill(null),
      currentPlayer: "X",
      players: [],
      winner: null,
    });
    router.push(`/game/${docRef.id}`);
  };

  const joinGame = () => {
    if (gameId) {
      router.push(`/game/${gameId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg">Tic Tac Toe</h1>

      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Play with a Friend</h2>
        <button 
          onClick={createGame} 
          className="bg-blue-600 text-white py-3 rounded-lg w-full hover:bg-blue-500 transition duration-300 mb-4"
        >
          Create Game & Share Link
        </button>

        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Enter Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <button 
            onClick={joinGame} 
            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition duration-300"
          >
            Join Game
          </button>
        </div>
      </div>

      <div className="w-full max-w-md">
        <FindDuel />
      </div>
    </div>
  );
}
