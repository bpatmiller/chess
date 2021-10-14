import React, { useState } from "react";
import { Board } from "./Board";
import { MyButton, ReadoutDiv, ReadoutPanel } from "./Styles";

const dim = 8;
const defaultFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

const loadFEN = (FEN: string) => {
  let squares = Array(dim ** 2).fill("-");
  let index = 0;
  for (let row of FEN.split("/")) {
    for (let ch of row) {
      if (isNaN(+ch)) {
        squares[index] = ch;
        index++;
      } else {
        index += parseInt(ch);
      }
    }
  }
  return squares;
};

const Game = () => {
  const [pieces, setPieces] = useState([loadFEN(defaultFEN)]);
  const [toMove, setToMove] = useState(["white"]);
  const [checks, setChecks] = useState([{ white: false, black: false }]);
  const [moveNumber, setMoveNumber] = useState(0);
  const [moves, setMoves] = useState([]);

  // move a piece from index to index
  const updateState = (
    newPosition: string[],
    check: { white: boolean; black: boolean }
  ) => {
    const nextToMove = toMove.slice(-1)[0] === "white" ? "black" : "white";

    setPieces(pieces.concat([newPosition]));
    setToMove(toMove.concat([nextToMove]));
    setChecks(checks.concat([check]));
    setMoveNumber(moveNumber + 1);

    return newPosition;
  };

  return (
    <React.Fragment>
      <Board
        updateState={updateState}
        pieces={pieces[moveNumber]}
        toMove={toMove[moveNumber]}
        check={checks[moveNumber]}
      />
      <ReadoutDiv>
        <ReadoutPanel>{toMove[moveNumber]} to move</ReadoutPanel>
        <ReadoutPanel>move {moveNumber}</ReadoutPanel>
        <MyButton
          onClick={() => {
            setMoveNumber(Math.max(moveNumber - 1, 0));
          }}
        >
          back 1 move
        </MyButton>
        <MyButton
          onClick={() => {
            setMoveNumber(Math.min(moveNumber + 1, pieces.length - 1));
          }}
        >
          forward 1 move
        </MyButton>
        <MyButton
          onClick={() => {
            setMoveNumber(0);
            setPieces([loadFEN(defaultFEN)]);
            setToMove(["white"]);
            setChecks([{ white: false, black: false }]);
          }}
        >
          reset board
        </MyButton>
      </ReadoutDiv>
    </React.Fragment>
  );
};

export { Game };
