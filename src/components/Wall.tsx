import React, { memo, useEffect } from 'react';
import styled from 'styled-components'
import { CellBase, CellText } from '../global';
import { ICell } from '../interfaces/Cell.interface';
import { ActionTypes } from './Board';


const WallCell = styled.div<any>`
${CellBase};
background-color:black;
transition: background-color 0.8s ease-out;

/* :hover{
  background-color:lightblue ;
}  */
`;


function Wall({ row, col, dispatch }: ICell) {
  const key: string = `${row}-${col}`;

  useEffect(() => {
    console.log("re-rendered wall");
  })
  return <WallCell
    row={row}
    col={col}
    id={key}
    key={`wall-node-${key}`}
    // onMouseUp={(e: MouseEvent) => handleClick(e, row, col)}
        onClick={(e: MouseEvent) => dispatch({ type: ActionTypes.SET_WALL_START_NODE, payload:{row,col}})}
        onMouseEnter={(e: MouseEvent) => dispatch({ type: ActionTypes.GENERATE_PROPOSAL_WALL, payload:{row,col}})}
  />
}

export default Wall;