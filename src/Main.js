import React, { useState, useEffect } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import Confetti from "react-confetti";
import Dice from "./Dice";
import data from "./data.js";
import bg from "./images/dice.png";

function Main() {
  const [numArray, setNumArray] = useState(data);
  const [moves, setMoves] = useState(0);
  const [attempts, setAttempts] = useState(3);
  const [currentNum, setCurrentNum] = useState(-1);
  const [showError, setShowError] = useState(false);
  const [showMissed, setShowMissed] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  function getRandomNumber() {
    return Math.floor(Math.random() * 6 + 1);
  }

  function handleClick() {
    // Restart Game
    if (gameLost || gameWon) {
      setGameWon(() => false);
      setGameLost(() => false);
      setAttempts(5);
      setMoves(0);
      setNumArray((prev) => {
        return prev.map((changeThisDice) => {
          return { ...changeThisDice, num: getRandomNumber(), selected: false };
        });
      });
      return;
    }

    // Handle Attempts
    setNumArray((prev) => {
      console.log(attempts);
      setMoves((prev) => prev + 1);
      let broken = false;
      prev.map((checkDice) => {
        if (broken) {
          return checkDice;
        }
        const anySelected = prev.some((die) => die.selected);
        if (
          anySelected &&
          !checkDice.selected &&
          currentNum === checkDice.num
        ) {
          broken = true;
          setShowMissed(() => true);
        }
        return checkDice;
      });
      // Rolls only when user has selected all current available numbers
      if (!broken) {
        return prev.map((changeThisDice) => {
          return !changeThisDice.selected
            ? { ...changeThisDice, num: getRandomNumber() }
            : changeThisDice;
        });
      }
      // Decrement attempt here
      if (broken === true) {
        setAttempts((prev) => prev - 1);
      }
      return prev;
    });
  }

  useEffect(() => {
    handleClick();
  }, []);

  useEffect(() => {
    const allSelected = numArray.every((die) => die.selected);
    if (allSelected) {
      setGameWon(() => true);
    }
  }, [numArray]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowError(() => false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showError]);

  useEffect(() => {
    const timer2 = setTimeout(() => {
      setShowMissed(() => false);
    }, 500);

    return () => clearTimeout(timer2);
  }, [showMissed]);

  useEffect(() => {
    if (attempts <= 0) {
      setGameLost(() => true);
    }
  }, [attempts]);

  function handleNumClick(numId) {
    setNumArray((prevArr) => {
      /* Does not re-renders after making the change */
      // let newArr = prevArr;
      // newArr[numId].selected = !(newArr[numId].selected);
      // return newArr;

      /* Tried doing similar thing, but it creates and adds a boolean data types into the array */
      // return prevArr = [...prevArr, prevArr[numId].selected = !prevArr[numId].selected ]

      const anySelected = prevArr.some((die) => die.selected);
      if (!anySelected) {
        setCurrentNum(() => prevArr[numId - 1].num);
      } else {
        if (currentNum !== prevArr[numId - 1].num) {
          setShowError(() => true);
          return prevArr;
        }
      }

      const newArr = prevArr.map((changeThisDice) => {
        return changeThisDice.id === numId
          ? { ...changeThisDice, selected: !changeThisDice.selected }
          : changeThisDice;
      });

      return newArr;
    });
  }

  return (
    <div className={showMissed ? "container containerShake" : "container"}>
      {/* {gameWon && <Confetti />} */}
      {gameWon && (
        <ConfettiExplosion duration={10000} zIndex={5} particleCount={500} />
      )}
      {/* <div className="bg-image"></div> */}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <h5 className={gameLost ? "attemptsOver" : "attempts"}>
        {gameLost || gameWon
          ? gameLost
            ? "Game Over, You Lost 😔"
            : `Hurray, you won the game in ${moves} moves.🥳`
          : `Number of Attempts left: ${attempts}`}
      </h5>
      {showError && (
        <div className="error">
          Deselect the previous value to start selecting a new one.
        </div>
      )}
      <div className="dices">
        {numArray.map((dice, index) => (
          <Dice
            key={index}
            index={index}
            diceData={dice}
            showError={showError}
            numClick={handleNumClick}
          />
        ))}
      </div>
      <button className="roll-button" onClick={handleClick}>
        {gameLost || gameWon ? "Reset Game" : "Roll"}
      </button>
    </div>
  );
}

export default Main;

// create animation
// add number of attempts
// add winning/losing states
// responsive
