import React, { useState } from "react";

function Dice(props) {
  const color = !props.diceData.selected ? "white" : "green";
  function handleClick() {
    return props.numClick(props.diceData.id);
  }

  return (
    <div
      className={props.showError ? "dice diceShake" : "dice"}
      onClick={handleClick}
      style={{ background: `${color}` }}
    >
      <span className="number">{props.diceData.num}</span>
    </div>
  );
}

export default Dice;
