import { useEffect, useState } from 'react';
import customAxios from '@/lib/axios';
import { getAnonId } from '@/utils/anonId';
import axios from 'axios';

interface GameState {
  loading: boolean;
  status: 'Pending' | 'Win' | 'Lose';
  targetLength: number;
  firstLetter: string;
  currentGuess: string;
  usedLetters: Record<string, 'red' | 'yellow' | 'blue'>;
  guesses: string[];
  colors: string[][];
  remainingAttempts: number;
  guessCount: number;
  wellPlacedLetters: { letter: string; position: number }[];
  handleLetter: (letter: string) => void;
  handleDelete: () => void;
  handleSubmit: () => void;
}

function getUserIdFromToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || null;
  } catch {
    return null;
  }
}

function getStorageKey(userId: string | undefined, anonId: string | undefined, date: string): string {
  const id = userId || anonId || 'unknown';
  return `gameState_${id}_${date}`;
}

export function useGame(): GameState {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'Pending' | 'Win' | 'Lose'>('Pending');
  const [targetLength, setTargetLength] = useState(0);
  const [firstLetter, setFirstLetter] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [colors, setColors] = useState<string[][]>([]);
  const [remainingAttempts, setRemainingAttempts] = useState(6);
  const [guessCount, setGuessCount] = useState(0);
  const [wellPlacedLetters, setWellPlacedLetters] = useState<{ letter: string; position: number }[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const today = new Date().toISOString().split('T')[0];
  const userId = getUserIdFromToken();
  const anonId = userId ? null : getAnonId();
  const storageKey = getStorageKey(userId ?? undefined, anonId ?? undefined, today);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('gameState_') && !key.includes(today)) {
            localStorage.removeItem(key);
          }
        }
        
        const res = await customAxios.get('/word/today');
        const wordLength = res.data.length;
        const first = res.data.firstLetter;

        setTargetLength(wordLength);
        setFirstLetter(first);
        setCurrentGuess(first.toLowerCase());

        const local = localStorage.getItem(storageKey);
        if (local) {
          const parsed = JSON.parse(local);
          setGuesses(parsed.guesses || []);
          setColors(parsed.colors || []);
          setStatus(parsed.status || 'Pending');
          setRemainingAttempts(parsed.remainingAttempts ?? 6);
          setGuessCount((parsed.guesses || []).length);
        }
      } catch (e) {
        console.error('Erreur chargement mot du jour', e);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);
  

  const handleLetter = (letter: string) => {
    if (status !== 'Pending') return;
    if (currentGuess.length >= targetLength) return;
    setCurrentGuess(prev => prev + letter.toLowerCase());
  };

  const handleDelete = () => {
    if (status !== 'Pending') return;
    if (currentGuess.length > 1) {
      setCurrentGuess(prev => prev.slice(0, -1));
    }
  };

  const handleSubmit = async () => {
    if (currentGuess.length !== targetLength) return;
  
    try {
      const res = await customAxios.post('/word/validate', {
        guess: currentGuess,
        ...(anonId && { anonId }),
      });
  
      const newGuessCount = guessCount + 1;
      setGuessCount(newGuessCount);
  
      const newGuesses = [...guesses, currentGuess];
      const newColors = [...colors, res.data.colors];
      const newWellPlaced = [...wellPlacedLetters];
  
      res.data.colors.forEach((color: string, index: number) => {
        if (color === 'red') {
          const letter = currentGuess[index];
          const alreadyExists = newWellPlaced.some(
            (item) => item.position === index && item.letter === letter
          );
          if (!alreadyExists) {
            newWellPlaced.push({ letter, position: index });
          }
        }
      });
  
      setWellPlacedLetters(newWellPlaced);
      setGuesses(newGuesses);
      setColors(newColors);
      setStatus(res.data.status);
      setRemainingAttempts(res.data.remainingAttempts);
      setCurrentGuess(firstLetter.toLowerCase());
  
      // ✅ On reset l’erreur si tout s’est bien passé
      setErrorMessage(null);
  
      const updatedState = {
        guesses: newGuesses,
        colors: newColors,
        status: res.data.status,
        remainingAttempts: res.data.remainingAttempts,
      };
      localStorage.setItem(storageKey, JSON.stringify(updatedState));
  
      if (res.data.status === 'Pending' && newGuessCount >= 6) {
        setStatus('Lose');
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const msg = e.response?.data?.message || 'Erreur';
  
        // ✅ Vérifie si le backend a rejeté car le mot n’existe pas
        if (msg.includes('dictionnaire') || msg.toLowerCase().includes('n’existe pas')) {
          setErrorMessage('Ce mot n’existe pas dans le dictionnaire.');
        } else {
          setErrorMessage(msg);
        }
      } else {
        console.error('Erreur inconnue', e);
        setErrorMessage('Une erreur inconnue est survenue.');
      }
    }
  };
  
  const usedLetters: Record<string, 'red' | 'yellow' | 'blue'> = {};
  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];
    const guessColors = colors[i];
    for (let j = 0; j < guess.length; j++) {
      const letter = guess[j];
      const color = guessColors[j];
      const current = usedLetters[letter];
      if (
        !current ||
        color === 'red' ||
        (color === 'yellow' && current === 'blue') ||
        (color === 'blue' && !['red', 'yellow'].includes(current))
      ) {
        usedLetters[letter] = color as 'red' | 'yellow' | 'blue';
      }
    }
  }
  
  return {
    loading,
    status,
    targetLength,
    firstLetter,
    currentGuess,
    usedLetters,
    guesses,
    colors,
    remainingAttempts,
    guessCount,
    wellPlacedLetters,
    handleLetter,
    handleDelete,
    handleSubmit,
    errorMessage, 
  };
}
