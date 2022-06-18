import React from 'react';
import styled, { css } from 'styled-components'
import { ICell } from '../interfaces/Cell.interface';

const cellBase = css`
position:relative;
border:1px solid black;

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
cursor:pointer;
`;

const FinishCell = styled.div<any>`
${cellBase};
${cellText};
background-color:blue;
cursor:pointer;
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

function Cell({ isVisited, isWall, isPartOfThePath,isStart,isFinish, row, col, handleClick }:ICell) {
  const key:string = `${row}-${col}`;
  type paramsType ={
    row:any,
    col:any,
    id:any,
    key:any,
    onClick:Function,
    onMouseDown:Function,
    onMouseUp:Function,
    onMouseOver:Function,
    onMouseEnter:Function,
    onMouseOut:Function,
    // onMouseOut:Function,
  }
  const params:paramsType = {
        row:{row}, 
        col:{col}, 
        id:{key}, 
        key:{key}, 
        onClick:(e: Event) => handleClick(e, row, col), 
        onMouseDown:(e: Event) => handleClick(e, row, col), 
        onMouseUp:(e: Event) => handleClick(e, row, col),
        onMouseEnter:(e: Event) => handleClick(e, row, col),
        onMouseOut:(e: Event) => handleClick(e, row, col),
        onMouseOver:(e: Event) => handleClick(e, row, col),
  };

      return isWall
        ? <WallCell  
          {...params}
        />
        : isPartOfThePath
          ? <PathCell  
          {...params}
          />
          : isVisited
            ? <VisitedCell 
              {...params}
              />
            : isStart
            ? <StartCell 
            {...params}
            >
                  {/* S */}
                </StartCell>
            : isFinish
            ? <FinishCell 
              {...params}
              >
                  {/* F */}
                </FinishCell>
            : <FreeCell 
                {...params}
                />
  
}

export default Cell;