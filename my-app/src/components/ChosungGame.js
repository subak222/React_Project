import React, { useState, useEffect, useRef } from 'react';
import data from './data';

const ChosungGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [songData, setSongData] = useState({});
  const [chosung, setChosung] = useState('');
  const [hint, setHint] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [answerResult, setAnswerResult] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [time, setTime] = useState(10);
  const [delay, setDelay] = useState(10000);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !gameOver && time > 0) {
      timerRef.current = setTimeout(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }
  }, [gameStarted, gameOver, time]);

  useEffect(() => {
    if (time === 0) {
      setAnswerResult('wrong');
      clearTimeout(timerRef.current);
      setDelay(3000);
      timerRef.current = setTimeout(() => {
        setGameOver(true);
      }, 3000);
    }
  }, [time]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setChosung('');
    setHint('');
    setScore(0);
    generateChosung();
    setTime(10);
    setAnswerResult('');
    setInputValue('');
  };

  const generateChosung = () => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const selectedData = data[randomIndex];

    if (selectedData && selectedData.chosung && selectedData.hint) {
      setSongData(selectedData);
      setChosung(selectedData.chosung);
      setHint(selectedData.hint);
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      clearTimeout(timerRef.current);

      if (inputValue === songData.answer) {
        setScore((prevScore) => prevScore + 1);
        setAnswerResult('correct');
        setInputValue('');
        setDelay(3000);
        timerRef.current = setTimeout(() => {
          generateChosung();
          setTime(10);
          setAnswerResult('');
        }, 3000);
      } else {
        setAnswerResult('wrong');
        setInputValue('');
        setDelay(3000);
        timerRef.current = setTimeout(() => {
          setGameOver(true);
        }, 3000);
      }
    }
  };

  const handleTryAgain = () => {
    setGameStarted(false);
    setGameOver(false);
  };

  useEffect(() => {
    if (gameStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameStarted]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score]);

  return (
    <div>
      <h1>Chosung Game</h1>
      {!gameStarted && !gameOver && (
        <button onClick={startGame}>Start Game</button>
      )}
      {gameStarted && !gameOver && (
        <>
          <div>
            <p>Chosung: {chosung}</p>
            <p>Hint: {hint}</p>
            <p>Time: {time} sec</p>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            {answerResult === 'correct' && <p>정답입니다!</p>}
            {answerResult === 'wrong' && (
              <p>틀렸습니다. 정답은 {songData.answer}입니다.</p>
            )}
          </div>
          <div>
            <p>Score: {score}</p>
          </div>
        </>
      )}
      {gameOver && (
        <div>
          <p>Game Over!</p>
          <p>Your Score: {score}</p>
          <p>High Score: {highScore}</p>
          <button onClick={handleTryAgain}>Try Again</button>
        </div>
      )}
    </div>
  );
};

export default ChosungGame;