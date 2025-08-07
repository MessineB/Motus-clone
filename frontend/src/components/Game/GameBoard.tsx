// GameBoard.tsx
import React, { useEffect, useState } from 'react';
import { useGame } from '@/hooks/useGame';
import GuessGrid from './GuessGrid';
import VirtualKeyboard from './VirtualKeyboard';
import WinModal from '../modal/WinModal';
import LoseModal from '../modal/LoseModal';
import { useAuth } from '@/context/AuthContext';

interface GameBoard {
  onSignupClick: () => void;
}

const GameBoard: React.FC<GameBoard> = ({ onSignupClick }) => {
  const {
    currentGuess,
    guesses,
    colors,
    usedLetters,
    handleLetter,
    handleDelete,
    handleSubmit,
    status,
    guessCount,
    targetLength, 
    wellPlacedLetters,
    errorMessage,
  } = useGame();

  const { isAuthenticated } = useAuth();
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'enter') handleSubmit();
      else if (key === 'backspace') handleDelete();
      else if (/^[a-z]$/.test(key)) handleLetter(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleLetter, handleDelete, handleSubmit]);

  useEffect(() => {
    console.log('Lettres bien placées:', wellPlacedLetters);
  }, [wellPlacedLetters]);

  useEffect(() => {
    if (status === 'Win') {
      setShowWinModal(true);
    } else if (guessCount >= 6) {
      setShowLoseModal(true);
    }
  }, [status, guessCount]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <GuessGrid
        guesses={guesses}
        currentGuess={currentGuess}
        colors={colors}
        wordLength={targetLength}
        wellPlacedLetters={wellPlacedLetters}
      />
      {errorMessage && (
      <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mt-2 font-medium">
      {errorMessage}
      </div>)}
      <VirtualKeyboard
        onLetter={handleLetter}
        onDelete={handleDelete}
        onEnter={handleSubmit}
        usedLetters={usedLetters}
        guesses={guesses}
        colors={colors}
      />

      {/* Modales de victoire/défaite */}
      {showWinModal && (
        <WinModal
          attempts={guessCount}
          open={showWinModal}
          onClose={() => setShowWinModal(false)}
          showSignupCTA={!isAuthenticated}
          onSignup={onSignupClick}
        />
      )}
      {showLoseModal && (
        <LoseModal
          open={showLoseModal}
          onClose={() => setShowLoseModal(false)}
          showSignupCTA={!isAuthenticated}
          onSignup={onSignupClick}
        />
      )}
    </div>
  );
};

export default GameBoard;
