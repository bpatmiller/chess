import React, { useRef, useState } from "react";
import { Square } from "./Square";
import { BoardDiv } from "./Styles";

const dim = 8;
const blank = "-";
const RookDirections = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

const BishopDirections = [
  [1, -1],
  [1, 1],
  [-1, -1],
  [-1, 1],
];

const QueenDirections = [
  [1, -1],
  [1, 1],
  [-1, -1],
  [-1, 1],
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

// XY in {1,...,8}
const indexToXY = (index: number) => {
  return [1 + (index % dim), dim - Math.floor(index / dim)];
};

const XYToIndex = (x: number, y: number) => {
  return (dim - y) * dim + x - 1;
};

const isWhite = (piece: string) => {
  return piece === piece.toUpperCase();
};

const isInBounds = (x: number, y: number) => {
  return x > 0 && y > 0 && x <= dim && y <= dim;
};

interface BoardProps {
  pieces: string[];
  toMove: string;
  check: { [key: string]: boolean };
  updateState: (
    newPosition: string[],
    check: { white: boolean; black: boolean }
  ) => string[];
}

const Board: React.FC<BoardProps> = (props: BoardProps) => {
  const pieces = props.pieces;
  const toMove = props.toMove;
  const check = props.check;
  // state for selection logic
  const [selected, setSelected] = useState(-1);
  const [targets, setTargets] = useState(Array(dim ** 2).fill(false));
  const [hasMoved, setHasMoved] = useState(Array(dim ** 2).fill(false));
  // const [check, setCheck] = useState({ white: false, black: false });

  const isOpenSquare = (x: number, y: number, position: string[] = pieces) => {
    if (x < 1 || x > 8 || y < 1 || y > 8) return false;
    const index = XYToIndex(x, y);
    return position[index] === blank;
  };

  // for Rook, Bishop, Queen, King
  const getStraightMoves = (
    index: number,
    directions: any[],
    position: string[] = pieces,
    limit = 8
  ) => {
    let targetSquares = Array(dim ** 2).fill(false);
    const [x, y] = indexToXY(index);
    const pieceIsWhite = isWhite(position[index]);

    for (const [dx, dy] of directions) {
      let d = 1;
      while (d <= limit && isOpenSquare(x + dx * d, y + dy * d, position)) {
        let i = XYToIndex(x + dx * d, y + dy * d);
        targetSquares[i] = true;
        d++;
      }
      if (d > limit) d = limit;
      if (isInBounds(x + dx * d, y + dy * d)) {
        let i = XYToIndex(x + dx * d, y + dy * d);
        if (isWhite(position[i]) !== pieceIsWhite) {
          targetSquares[i] = true;
        }
      }
    }
    return targetSquares;
  };

  const getRookMoves = (index: number, position: string[] = pieces) => {
    return getStraightMoves(index, RookDirections, position);
  };

  const getBishopMoves = (index: number, position: string[] = pieces) => {
    return getStraightMoves(index, BishopDirections, position);
  };

  const getQueenMoves = (index: number, position: string[] = pieces) => {
    return getStraightMoves(index, QueenDirections, position);
  };

  const getKingMoves = (index: number, position: string[] = pieces) => {
    const normalMoves = getStraightMoves(index, QueenDirections, position, 1);
    const kingIsWhite = isWhite(position[index]);

    if (!hasMoved[index]) {
      const whiteRookSquares = [XYToIndex(1, 1), XYToIndex(dim, 1)];
      const blackRookSquares = [XYToIndex(1, dim), XYToIndex(dim, dim)];
      const rookSquares = kingIsWhite ? whiteRookSquares : blackRookSquares;

      for (const rookIndex of rookSquares) {
        let canCastle = true;
        if (!hasMoved[rookIndex]) {
          // TODO cant castle into check
          const delta = index - rookIndex > 0 ? 1 : -1;
          let inbetween = rookIndex + delta;
          while (inbetween !== index) {
            if (position[inbetween] !== blank) {
              canCastle = false;
            }
            inbetween += delta;
          }
          if (canCastle) {
            normalMoves[rookIndex] = true;
          }
        }
      }
    }

    return normalMoves;
  };

  const getPawnMoves = (index: number, position: string[] = pieces) => {
    let targetSquares = Array(dim ** 2).fill(false);

    const pieceIsWhite = isWhite(position[index]);
    const [x, y] = indexToXY(index);
    const dir = pieceIsWhite ? 1 : -1;

    const forwardMoves = hasMoved[index] ? [1] : [1, 2];
    const diagonalMoves = [
      [-1, dir],
      [1, dir],
    ];

    for (const move of forwardMoves) {
      if (isOpenSquare(x, y + dir * move, position)) {
        const i = XYToIndex(x, y + dir * move);
        targetSquares[i] = true;
      }
    }

    for (const [dx, dy] of diagonalMoves) {
      if (
        isInBounds(x + dx, y + dy) &&
        !isOpenSquare(x + dx, y + dy, position)
      ) {
        const i = XYToIndex(x + dx, y + dy);
        const canTake = pieceIsWhite !== isWhite(position[i]);
        if (canTake) targetSquares[i] = true;
      }
    }
    return targetSquares;
  };

  const getKnightMoves = (index: number, position: string[] = pieces) => {
    let targetSquares = Array(dim ** 2).fill(false);
    const directions = [-1, 1];
    const [x, y] = indexToXY(index);

    for (const dx of directions) {
      for (const dy of directions) {
        const angles = [
          [x + 2 * dx, y + dy],
          [x + dx, y + 2 * dy],
        ];
        for (const [cx, cy] of angles) {
          if (isInBounds(cx, cy)) {
            const i = XYToIndex(cx, cy);
            if (
              position[i] === blank ||
              isWhite(position[i]) !== isWhite(position[index])
            ) {
              targetSquares[i] = true;
            }
          }
        }
      }
    }
    return targetSquares;
  };

  const canBeMoved = (index: number) => {
    const pieceIsWhite = isWhite(pieces[index]);
    return pieceIsWhite === (toMove === "white");
  };

  const getTargetSquares = (index: number, position: string[] = pieces) => {
    const pieceType: string = position[index].toLowerCase();
    const pieceMappings: any = {
      "-": (index: number) => {
        return Array(dim ** 2).fill(false);
      },
      r: getRookMoves,
      p: getPawnMoves,
      b: getBishopMoves,
      n: getKnightMoves,
      q: getQueenMoves,
      k: getKingMoves,
    };
    let fn = pieceMappings[pieceType];
    return fn(index, position);
  };

  const updateCheck = (newPosition: string[]) => {
    let newCheckState = { white: false, black: false };
    for (const [i, p] of newPosition.entries()) {
      if (p !== blank) {
        const pieceIsWhite = isWhite(p);
        const targetSquares = getTargetSquares(i, newPosition);
        for (const [j, t] of targetSquares.entries()) {
          if (t) {
            const target = newPosition[j];
            if (target !== blank) {
              const targetIsKing = target.toLowerCase() === "k";
              const targetIsWhite = isWhite(target);
              if (targetIsKing && pieceIsWhite !== targetIsWhite) {
                const inCheck = targetIsWhite ? "white" : "black";
                newCheckState[inCheck] = true;
              }
            }
          }
        }
      }
    }
    return newCheckState;
  };

  const handleSquareClick = (index: number) => {
    // move a piece
    if (targets[index]) {
      hasMoved[index] = true;
      setTargets(Array(dim ** 2).fill(false));
      setSelected(-1);

      let newPosition = pieces.map((x) => x);
      newPosition[index] = newPosition[selected];
      newPosition[selected] = "-";

      let newCheck = updateCheck(newPosition);
      props.updateState(newPosition, newCheck);
      return;
    }

    // select and deselect a piece
    if (index === selected) {
      setSelected(-1);
      setTargets(Array(dim ** 2).fill(false));
    } else {
      if (canBeMoved(index)) {
        const targetSquares = getTargetSquares(index);
        setSelected(index);
        setTargets(targetSquares);
      } else {
        setTargets(Array(dim ** 2).fill(false));
        setSelected(-1);
      }
    }
  };

  return (
    <div>
      <BoardDiv>
        {pieces.map((piece: string, index: number) => (
          <Square
            index={index}
            name={piece}
            selection={selected}
            target={targets[index]}
            clickHandler={handleSquareClick}
            key={index}
            check={(piece: string, index: number) => {
              return (
                (piece === "k" && check["black"]) ||
                (piece === "K" && check["white"])
              );
            }}
          ></Square>
        ))}
      </BoardDiv>
    </div>
  );
};

export { Board };
