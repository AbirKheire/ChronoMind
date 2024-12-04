import React, { useRef, useState, useEffect } from "react";
import logo from "./assets/logoorangef.png";
import "./App.css";
import "./dice.css"; // Ensure the dice styles are imported

// Import soundtrack
import soundtrack from "./assets/countdown.mp3"; // Replace with your actual file path

const App = () => {
  const diceRef = useRef(null); // Reference to the dice element
  const [timer, setTimer] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState(""); // Message for "Ready?", countdown, "GO!", or "Time's up!"
  const soundtrackRef = useRef(null); // Reference for the soundtrack audio

  // Map dice face to timer duration
  const diceToTimer = {
    1: 15,
    2: 25,
    3: 35,
    4: 45,
    5: 55,
    6: 60,
  };

  const playSoundtrack = () => {
    if (!soundtrackRef.current) {
      soundtrackRef.current = new Audio(soundtrack);
    }
    soundtrackRef.current.play();
  };

  const stopSoundtrack = () => {
    if (soundtrackRef.current) {
      soundtrackRef.current.pause();
      soundtrackRef.current.currentTime = 0; // Reset soundtrack to the beginning
    }
  };

  const rollDice = () => {
    if (isRolling) return; // Prevent multiple rolls at once

    // Reset timer, countdown, and message
    setTimer(null);
    setCountdown(null);
    setMessage("");
    stopSoundtrack(); // Stop any playing soundtrack

    setIsRolling(true); // Set rolling state
    const random = Math.floor(Math.random() * 6) + 1; // Generate random dice face

    const dice = diceRef.current; // Access dice DOM element
    if (!dice) return;

    // Animate the dice
    dice.style.animation = "rolling 4s";
    setTimeout(() => {
      // Set dice face based on random roll
      switch (random) {
        case 1:
          dice.style.transform = "rotateX(0deg) rotateY(0deg)";
          break;
        case 6:
          dice.style.transform = "rotateX(180deg) rotateY(0deg)";
          break;
        case 2:
          dice.style.transform = "rotateX(-90deg) rotateY(0deg)";
          break;
        case 5:
          dice.style.transform = "rotateX(90deg) rotateY(0deg)";
          break;
        case 3:
          dice.style.transform = "rotateX(0deg) rotateY(90deg)";
          break;
        case 4:
          dice.style.transform = "rotateX(0deg) rotateY(-90deg)";
          break;
        default:
          break;
      }

      dice.style.animation = "none";

      // Start the transitional messages
      startTransition(() => {
        const duration = diceToTimer[random];
        setTimer(duration);
        setCountdown(duration);
      });

      setIsRolling(false); // End rolling state
    }, 4050); // Duration matches dice animation time
  };

  const startTransition = (onComplete) => {
    playSoundtrack(); // Play the soundtrack
    setMessage("Ready?");
    setTimeout(() => {
      setMessage("3");
      setTimeout(() => {
        setMessage("2");
        setTimeout(() => {
          setMessage("1");
          setTimeout(() => {
            setMessage("GO!");
            stopSoundtrack(); // Stop the soundtrack when the timer starts
            setTimeout(() => {
              setMessage(""); // Clear message
              onComplete(); // Trigger the callback to start the timer
            }, 1000); // Show "GO!" for 1 second
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000); // "Ready?" stays for 1 second
  };

  // Countdown logic
  useEffect(() => {
    if (countdown === null || countdown <= 0) {
      if (countdown === 0) {
        setMessage("Time's up!"); // Show "Time's up!" when countdown ends
        setCountdown(null); // Clear the countdown
      }
      return;
    }

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
          <img
            src={logo}
            alt="Logo ChronoMind"
            style={{ width: "200px", marginRight: "10px" }}
          />
        </h1>
        <button onClick={rollDice} disabled={isRolling}>
          {isRolling ? "Rolling..." : "Roll the dice!"}
        </button>
        <div className="container">
          <div className="dice" ref={diceRef}>
            <div className="face front"></div>
            <div className="face back"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
            <div className="face right"></div>
            <div className="face left"></div>
          </div>
        </div>
        {message && (
          <p
            className="transition-message"
            style={{
              fontSize: "3rem",
              color: message === "GO!" || message === "Time's up!" ? "red" : "blue",
              transition: "opacity 0.5s",
            }}
          >
            {message}
          </p>
        )}
        {timer && countdown !== null && <p>Countdown: {countdown} seconds</p>}
      </div>
    </div>
  );
};

export default App;
