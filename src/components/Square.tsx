import React, { useRef } from "react";
import { Colors, SquareDiv, SquareInsertDiv } from "./Styles";
import { ReactComponent as Horse } from "../sprites/horse.svg";
import { ReactComponent as Pawn } from "../sprites/pawn.svg";
import { ReactComponent as Bishop } from "../sprites/bishop.svg";
import { ReactComponent as Rook } from "../sprites/rook.svg";
import { ReactComponent as King } from "../sprites/king.svg";
import { ReactComponent as Queen } from "../sprites/queen.svg";

const dim = 8;

interface SquareProps {
  name: string;
  selection: number;
  index: number;
  target: boolean;
  clickHandler: (index: number) => void;
  check: (piece: string, index: number) => boolean;
}

const iconDict: any = {
  n: Horse,
  r: Rook,
  b: Bishop,
  k: King,
  q: Queen,
  p: Pawn,
  "-": Horse,
};

const Square: React.FC<SquareProps> = (props: SquareProps) => {
  const isWhite = props.name === props.name.toUpperCase();
  const Icon = iconDict[props.name.toLowerCase()];
  return (
    <SquareDiv
      selected={props.selection === props.index}
      target={props.target}
      color={
        (props.index + Math.floor(props.index / dim)) % 2 === 0
          ? Colors.beige
          : Colors.grey
      }
      isWhite={isWhite}
      check={props.check(props.name, props.index)}
    >
      <SquareInsertDiv onClick={() => props.clickHandler(props.index)}>
        {props.name === "-" ? (
          ""
        ) : (
          <Icon
            fill={isWhite ? Colors.white : Colors.black}
            stroke={isWhite ? Colors.black : Colors.white}
            width="100%"
            height="100%"
            transform={isWhite ? "scale(1.25,1.25)" : "scale(-1.25,1.25)"}
            style={{
              filter: "drop-shadow( 3px 3px 2px rgba(80, 0, 0, .7))",
            }}
            id={"icon".concat(props.index.toString())}
          />
        )}
      </SquareInsertDiv>
    </SquareDiv>
  );
};
export { Square };
