import React from 'react';
import styled, { css } from 'styled-components'

const cellBase = css`
position:relative;
border:1px solid black;

grid-row: ${(props:any) => props.row + 1};
grid-column: ${(props:any) => props.col + 1};
`;

const cellText = css`
display: flex;
justify-content: center;
align-items:center;
color:white;
font-size:2rem;
font-weight:bold;
`;

const FreeCell = styled.div<any>`
${cellBase};
background-color:lightblue;
transition: background-color 0.8s ease-out;

:hover{
background-color:${(props:any) => (props.isVisited ? 'lightblue' : 'gray')};
transition: background-color 0.4s ease-in;
}
`;

const StartCell = styled.div<any>`
${cellBase};
${cellText};
background-color:green;
`;

const FinishCell = styled.div<any>`
${cellBase};
${cellText};
background-color:blue;
`;

const VisitedCell = styled.div<any>`
${cellBase};
${cellText};
background-color:lightgray;
`;

const PathCell = styled.div<any>`
${cellBase};
${cellText};
background-color:white;
`;

const WallCell = styled.div<any>`
${cellBase};
${cellText};
background-color:black;
`;

function Cell({ isVisited, isWall, isPartOfThePath, row, col, type, handleClick }) {
  const key = `${row}-${col}`;

  switch (type) {
    case 'start':
      return <StartCell row={row} col={col} id={key} key={key}>S</StartCell>
    case 'finish':
      return <FinishCell row={row} col={col} id={key} key={key}>F</FinishCell>
    default:
      return isWall
        ? <WallCell row={row} col={col} id={key} key={key} onClick={() => handleClick(row, col)}></WallCell>
        : isPartOfThePath 
          ?<PathCell row={row} col={col} id={key} key={key} onClick={() => handleClick(row, col)}></PathCell>
          : isVisited
            ? <VisitedCell row={row} col={col} id={key} key={key} onClick={() => handleClick(row, col)}></VisitedCell>
            : <FreeCell row={row} col={col} id={key} key={key} onClick={() => handleClick(row, col)}></FreeCell>
  }
}

export default Cell;