import React, { MouseEventHandler } from 'react';
import styled, { css } from 'styled-components'
import { ICell } from '../interfaces/Cell.interface';

const cellBase = css`
position:relative;
border:1px solid black;
cursor:pointer;

grid-row: ${(props: any) => props.row + 1};
grid-column: ${(props: any) => props.col + 1};
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
background-color:${(props: any) => (props.isVisited ? 'lightblue' : 'gray')};
transition: background-color 0.4s ease-in;
}
`;

const StartCell = styled.div<any>`
${cellBase};
${cellText};
background-color:green;
z-index:1000;
`;

const FinishCell = styled.div<any>`
${cellBase};
${cellText};
background-color:blue;
z-index:1000;
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

function Cell({ isVisited, isWall, isPartOfThePath, isStart, isFinish, row, col, handleClick }: ICell) {
  const key: string = `${row}-${col}`;

  type ordinaryNodeParamsType = {
    row: any,
    col: any,
    id: any,
    key: any,
    onClick: Function,
    onMouseEnter: Function,
  }

  type targetNodeParamsType = {
    row: any,
    col: any,
    id: any,
    key: any,
    onMouseDown: Function,
    onMouseUp: Function,
    onMouseEnter: Function,
  }

  const targetNodeParams: targetNodeParamsType = {
    row: { row },
    col: { col },
    id: { key },
    key: { key },
    onMouseDown: (e: MouseEvent) => handleClick(e, row, col),
    onMouseUp: (e: MouseEvent) => handleClick(e, row, col),
    onMouseEnter: (e: MouseEvent) => handleClick(e, row, col),
  };

  const ordinaryNodeParams: ordinaryNodeParamsType = {
    row: { row },
    col: { col },
    id: { key },
    key: { key },
    onClick: (e: MouseEvent) => handleClick(e, row, col),
    onMouseEnter: (e: MouseEvent) => handleClick(e, row, col),
  };

  return isWall
    ? <WallCell
      {...ordinaryNodeParams}
    />
    : isPartOfThePath
      ? <PathCell
        {...ordinaryNodeParams}
      />

      : isStart
        ? <StartCell
          {...targetNodeParams}
        >
          {/* S */}
        </StartCell>
        : isFinish
          ? <FinishCell
            {...targetNodeParams}
          >
            {/* F */}
          </FinishCell>
          : isVisited
            ? <VisitedCell
              {...ordinaryNodeParams}
            />
            : <FreeCell
              {...ordinaryNodeParams}
            />

}

export default Cell;