import React from 'react';

interface GuessGridProps {
  guesses: string[];
  colors: string[][];
  currentGuess: string;
  maxAttempts?: number;
  wordLength: number;
  wellPlacedLetters?: { letter: string; position: number }[];
}

const GuessGrid: React.FC<GuessGridProps> = ({
  guesses,
  colors,
  currentGuess,
  maxAttempts = 6,
  wordLength,
  wellPlacedLetters = [],
}) => {
  const rows = [];

  for (let i = 0; i < maxAttempts; i++) {
    const isCurrent = i === guesses.length;
    const guessColors = colors[i] || [];

    const letters = [];

    for (let j = 0; j < wordLength; j++) {
      let char = '';
      let isPreFilled = false;

      if (isCurrent) {
        // Ligne active (en cours de saisie)
        if (j < currentGuess.length) {
          char = currentGuess[j];
        } else if (
          currentGuess.length === 1 && // Seule la première lettre a été tapée
          j > 0
        ) {
          const match = wellPlacedLetters.find((l) => l.position === j);
          if (match) {
            char = match.letter;
            isPreFilled = true;
          }
        }
      } else {
        // Lignes déjà soumises
        char = guesses[i]?.[j] || '';
      }

      const color = guessColors[j] || (isCurrent ? 'current' : 'gray');

      let cellClass = 'bg-gray-200 text-black';
      if (color === 'red') cellClass = 'bg-red-500 text-white';
      else if (color === 'yellow') cellClass = 'bg-yellow-400 text-white';
      else if (color === 'blue') cellClass = 'bg-blue-400 text-white';
      else if (color === 'current') cellClass = 'bg-blue-300 text-black';

      letters.push(
        <div
          key={j}
          className={`w-10 h-10 border text-xl font-bold flex items-center justify-center rounded ${cellClass} ${
            isPreFilled ? 'text-gray-400 italic' : ''
          }`}
        >
          {char.toUpperCase()}
        </div>
      );
    }

    rows.push(
      <div key={i} className="flex gap-1">
        {letters}
      </div>
    );
  }

  return <div className="grid gap-2">{rows}</div>;
};

export default GuessGrid;
