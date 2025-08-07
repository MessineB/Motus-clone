import React from 'react';

interface VirtualKeyboardProps {
  onLetter: (key: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  usedLetters?: Record<string, 'red' | 'yellow' | 'blue'>;
  guesses?: string[];
  colors?: string[][];
}

const KEYS = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['ENTER', 'W', 'X', 'C', 'V', 'B', 'N', 'DEL'],
];

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onLetter,
  onDelete,
  onEnter,
  usedLetters = {},
}) => {
  const handleKeyClick = (key: string) => {
    if (key === 'ENTER') {
      onEnter();
    } else if (key === 'DEL') {
      onDelete();
    } else {
      onLetter(key.toLowerCase());
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      {KEYS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1">
          {row.map((key) => {
            const letter = key.toLowerCase();
            const color = usedLetters[letter] || 'gray';

            let bg = 'bg-gray-300';
            if (color === 'red') bg = 'bg-red-500 text-white';
            if (color === 'yellow') bg = 'bg-yellow-400 text-white';
            if (color === 'blue') bg = 'bg-blue-400 text-white';

            return (
              <button
                key={key}
                className={`px-3 py-2 rounded font-bold ${bg}`}
                onClick={() => handleKeyClick(key)}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
