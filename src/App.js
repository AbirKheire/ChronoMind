import React, { useState, useEffect } from "react";
import logo from './assets/logoorangef.png';
import './App.css';

const App = () => {
  const [dice, setDice] = useState(null);
  const [timer, setTimer] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  // Dice logic remains unchanged
  const diceToTimer = {
    1: 15,
    2: 25,
    3: 35,
    4: 45,
    5: 55,
    6: 60,
  };

  const rollDice = () => {
    setIsRolling(true);
    const rolled = Math.floor(Math.random() * 6) + 1;
    setTimeout(() => {
      setDice(rolled);
      const duration = diceToTimer[rolled];
      setTimer(duration);
      setCountdown(duration);
      setIsRolling(false);
    }, 1000);
  };

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  return (
    <div>
      {/* Background with circles */}
      <div className="background">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
      </div>

      {/* Main content */}
      <div className="text-container">
        <h1>
          <img src={logo} alt="Logo ChronoMind" style={{ width: "50px", marginRight: "10px" }} />
          CHRONO MIND
        </h1>
        <p>Round 1</p>
        <button onClick={rollDice} disabled={isRolling}>
          {isRolling ? "Rolling..." : "Generate a Timer"}
        </button>
        {dice && <p>Dice Rolled: {dice}</p>}
        {timer && <p>Timer: {timer} seconds</p>}
        {countdown !== null && <p>Countdown: {countdown} seconds</p>}
      </div>
    </div>
  );
};

export default App;
