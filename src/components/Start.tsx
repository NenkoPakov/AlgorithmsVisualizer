import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components'
import { CellBase, CellText } from '../global';
import { ICell } from '../interfaces/Cell.interface';
import { ActionTypes } from './Board';

const StartNode = styled.div<any>`
  ${CellBase};
  background-color:green;
  cursor:move;

  opacity: ${(props: any) => props.isDragged ? .5 : 1};
  
  :hover{
    transform:scale(1.2);
  } 
  `;

function Start({ row, col, dispatch }: ICell) {
  const key: string = `${row}-${col}`;

  const [isDragged, setIsDragged] = useState(false);

  const _onDragEnd = (e: MouseEvent) => {
    e.preventDefault();

    dispatch({ type: ActionTypes.SET_START_NODE });
    setIsDragged(false);
  }

  useEffect(() => {
    console.log(isDragged);
  }, [isDragged])

  return <StartNode
    draggable={true}
    isDragged={isDragged}
    row={row}
    col={col}
    id={key}
    key={`start-node-${key}`}
    onDragStart={() => setIsDragged(true)}
    onDragEnd={(event: MouseEvent) => _onDragEnd(event)}
  // onMouseDown={(e: MouseEvent) =>handleClick(e, row, col)}
  // onMouseUp={(e: MouseEvent) =>handleClick(e, row, col)}
  />
}

export default Start;