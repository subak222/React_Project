import React, { useState, useEffect, useRef } from 'react';
import data from './data';
import './ChosungGame.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const ChosungGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [songData, setSongData] = useState({});
  const [chosung, setChosung] = useState('');
  const [hint, setHint] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState();
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
    if (event.key === 'Enter' && time > 0 && !inputRef.current.hasAttribute('readonly')) {
      clearTimeout(timerRef.current);
  
      if (inputValue === songData.answer) {
        setScore((prevScore) => prevScore + 1);
        setAnswerResult('correct');
        setInputValue('');
        setDelay(3000);
        inputRef.current.setAttribute('readonly', 'readonly'); // 입력창을 readonly 상태로 변경
        timerRef.current = setTimeout(() => {
          generateChosung();
          setTime(10);
          setAnswerResult('');
          inputRef.current.removeAttribute('readonly'); // 입력창의 readonly 속성 제거
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 3000);
      } else {
        setAnswerResult('wrong');
        setInputValue('');
        setDelay(3000);
        inputRef.current.setAttribute('readonly', 'readonly'); // 입력창을 readonly 상태로 변경
        timerRef.current = setTimeout(() => {
          setGameOver(true);
        }, 3000);
      }
    }
  };
  
  const handleInputFocus = () => {
    if (!inputRef.current.hasAttribute('readonly')) {
      inputRef.current.focus();
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
    const db = firebase.firestore();
    if (score > highScore) {
      setHighScore(score);
      db.collection('scoreboard').doc("scores").update({"bestscore": score});
    }
  }, [score]);

  useEffect(()=> {
    const db = firebase.firestore();
    db.collection('scoreboard').get().then((result) =>{
      result.forEach((doc)=>{
        setHighScore(Object.values(doc.data())[0]);
      })
    })
  })

  return (
    <div className="container">
      <h1 className="title">샤이니 노래 제목 초성 퀴즈</h1>
      {!gameStarted && !gameOver && (
        <button className="start-button" onClick={startGame}>
          게임 시작
        </button>
      )}
      {gameStarted && !gameOver && (
        <>
          <div>
            <p className="score">내 점수: {score}</p>
          </div>
          <div>
            <p>초성: {chosung}</p>
            <p>힌트: {hint}</p>
            <p>남은 시간: {time} sec</p>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
            />
            {answerResult === 'correct' && <p>정답입니다!</p>}
            {answerResult === 'wrong' && (
              <p>틀렸습니다. 정답은 {songData.answer}입니다.</p>
            )}
          </div>
        </>
      )}
      {gameOver && (
        <div>
          <p className='endgame'>게임 종료!</p>
          <div className='bigbox'>
            <div className="box">
              <p>내 점수</p>
              <p>{score}</p>
            </div>
            <div className="box">
              <p>최고 기록</p>
              <p>{highScore}</p>
            </div>
          </div>
          <button className="try-again-button" onClick={handleTryAgain}>
            재시작
          </button>
        </div>
      )}
    </div>
  );
};

export default ChosungGame;
