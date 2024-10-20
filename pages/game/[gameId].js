import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Import only Firestore

import TicTacToe from "../../components/TicTacToe";
import { FiCopy } from "react-icons/fi"; // Import a copy icon from react-icons

const GamePage = () => {
  const router = useRouter();
  const { gameId } = router.query;
  const [game, setGame] = useState(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (!gameId) return; // Guard clause to avoid undefined gameId

    const gameRef = doc(db, "games", gameId);

    const unsubscribeGame = onSnapshot(gameRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setGame(docSnapshot.data());
      }
    });

    // Player joining logic
    const handleJoinGame = async (playerId) => {
      const gameSnapshot = await getDoc(gameRef);
      const gameData = gameSnapshot.data();

      if (!gameData.players.includes(playerId)) {
        if (gameData.players.length < 2) {
          const newPlayers = [...gameData.players, playerId];
          await updateDoc(gameRef, { players: newPlayers });
          setPlayer(playerId === gameData.players[0] ? "X" : "O");
        } else {
          alert("The game already has two players.");
          router.push("/");
        }
      } else {
        // User is already in the game
        setPlayer(playerId === gameData.players[0] ? "X" : "O");
      }
    };

    // Simulate a player joining
    const simulatedPlayerId = "player1"; // Replace this with your logic for assigning player IDs
    handleJoinGame(simulatedPlayerId);

    return () => {
      unsubscribeGame();
    };
  }, [gameId]);

  // Function to copy the game ID to clipboard
  const handleCopyGameId = () => {
    if (gameId) {
      navigator.clipboard.writeText(gameId);
    }
  };

  if (!game) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="  p-6 w-full max-w-md text-center">
        <h1 className="text-7xl font-bold mb-4 text-white">Tic Tac Toe</h1>
        <div className="flex items-center justify-center mt-10">
          <span className="text-lg font-mono text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
            {gameId}
          </span>
          <button
            onClick={handleCopyGameId}
            className="ml-3 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
            aria-label="Copy Game ID"
          >
            <FiCopy className="text-xl" />
          </button>
        </div>
        <TicTacToe game={game} gameId={gameId} player={player} />
      </div>
    </div>
  );
};

export default GamePage;
