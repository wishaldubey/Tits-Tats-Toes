import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const TicTacToe = ({ game, gameId, player }) => {
  const [currentGame, setCurrentGame] = useState(game);
  const [mySymbol, setMySymbol] = useState("");
  const [flashMessage, setFlashMessage] = useState(""); // State for flash message

  useEffect(() => {
    setCurrentGame(game);
    setMySymbol(game.players[0] === player ? "X" : "O");
  }, [game, player]);

  const handleMove = async (index) => {
    if (!currentGame || currentGame.board[index] || currentGame.winner) return;

    if (currentGame.currentPlayer !== player) {
      setFlashMessage("It's not your turn!"); // Set flash message
      setTimeout(() => setFlashMessage(""), 600); // Clear message after 3 seconds
      return;
    }

    const newBoard = [...currentGame.board];
    newBoard[index] = currentGame.currentPlayer;

    const winner = checkWinner(newBoard);
    const nextPlayer = currentGame.currentPlayer === "X" ? "O" : "X";

    if (checkDraw(newBoard)) {
      await updateDoc(doc(db, "games", gameId), {
        board: newBoard,
        winner: "Draw",
      });
      return;
    }

    await updateDoc(doc(db, "games", gameId), {
      board: newBoard,
      currentPlayer: nextPlayer,
      winner: winner || null,
    });
  };

  const handlePlayAgain = async () => {
    await updateDoc(doc(db, "games", gameId), {
      board: Array(9).fill(null),
      currentPlayer: "X",
      winner: null,
    });
  };

  const checkWinner = (board) => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
  
    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // Return the player's symbol ("X" or "O")
      }
    }
    return null;
  };

  const checkDraw = (board) => {
    return board.every((square) => square !== null);
  };

  const renderSquare = (index) => {
    const isWinningSquare = currentGame.winner?.includes(index);
    return (
      <button
        className={`square w-20 h-20 md:w-34 md:h-34 flex items-center justify-center text-4xl font-bold border-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
          isWinningSquare ? "bg-green-300" : "bg-gray-200"
        } ${currentGame.board[index] === "X" ? "text-blue-600" : "text-red-600"}`}
        onClick={() => handleMove(index)}
      >
        {currentGame.board[index]}
      </button>
    );
  };

  return (
    <div className="flex flex-col p-6 space-y-6 min-h-screen">
      <h2 className="text-4xl font-semibold text-purple-500">
        {currentGame.winner ? `Winner: ${currentGame.winner}` : `Player ${currentGame.currentPlayer}'s Turn`}
      </h2>
      {flashMessage && ( // Conditional rendering of the flash message
        <div className="bg-red-500 text-white p-2 rounded-lg mb-4">
          {flashMessage}
        </div>
      )}
      <div className="grid grid-cols-3 gap-6 md:gap-6">
        {[...Array(9)].map((_, index) => renderSquare(index))}
      </div>
      {currentGame.winner && (
        <button
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-xl font-medium shadow-lg hover:bg-blue-700 transition-colors"
          onClick={handlePlayAgain}
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default TicTacToe;
