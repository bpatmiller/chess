import styled from "styled-components";

const transitionShort = "0.075s";

const Colors = {
  black: "#22223b",
  grey: "#4a4e69",
  lightgrey: "#9a8c98",
  beige: "#c9ada7",
  white: "#f2e9e4",
  red: "#70101010",
  pink: "rgba(250, 100, 200, 0.9)",
};

interface SquareDivProps {
  selected: boolean;
  target: boolean;
  color: string;
  isWhite: boolean;
  check: boolean;
}

const SquareDiv = styled.div`
  font-size: 1.5em;
  text-align: center;
  flex: 0 0 12.5%;
  width: 12.5%;
  height: 12.5%;
  background-color: ${(props: SquareDivProps) =>
    props.selected ? "lightgreen" : props.color};
  div {
    background-color: ${(props: SquareDivProps) =>
      props.target ? "rgba(100,100,200,0.7)" : "rgba(1,1,1,0)"};
    svg {
      ${(props: SquareDivProps) => (props.check ? "fill: red;" : "")}
    }
  }
  :hover {
    div {
      svg {
        transform: scale(
          ${(props: SquareDivProps) => (props.isWhite ? 1.5 : -1.5)},
          1.5
        );
        transition: transform ${transitionShort};
      }
    }
  }
`;

const SquareInsertDiv = styled.div`
  width: 100%;
  height: 100%;
  z-index: -100;
`;

const BoardDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 800px;
  width: 800px;
  margin: auto;
  padding: 32px;
`;

const ReadoutDiv = styled.div`
  display: flex;
  height: 100%;
  gap: 32px;
  padding: 64px;
  padding-top: 0px;
  margin: auto;
  justify-content: center;
`;

const ReadoutPanel = styled.div`
  display: flex;
  background-color: ${Colors.grey};
  color: ${Colors.white};

  // box-shadow: 8px 8px 10px 2px ${Colors.grey};
  padding: 16px;
`;

const MyButton = styled.button`
  background-color: ${Colors.black};
  color: ${Colors.white};
  // box-shadow: 8px 8px 10px 2px ${Colors.grey};
  padding: 16px;
  border: 0px;
  font-size: inherit;

  :hover {
    transform: translate(-5%, -5%);
    background-color: ${Colors.pink};
    transition: transform ${transitionShort},
      background-color ${transitionShort};
  }
`;

export {
  Colors,
  SquareDiv,
  BoardDiv,
  SquareInsertDiv,
  ReadoutDiv,
  ReadoutPanel,
  MyButton,
};
