import React, { useState } from 'react';
import styled from 'styled-components'
import { BackgroundColorType, NodeBase } from '../global';
import {  BaseProps } from '../interfaces/Cell.interface';
import { ActionTypes } from './BoardManager';

const FinishNode = styled.div<any>`
  ${NodeBase};
  background-color:${BackgroundColorType.Red};
  cursor:move;
  opacity: ${(props: {isDragged:boolean}) => props.isDragged?.5:1};

  :hover{
    transform:scale(1.2);
  } 
`;

const Finish = ({ row, col, boardManagerDispatch }: BaseProps) => {
  const key: string = `${row}-${col}`;

  const [isDragged, setIsDragged] = useState(false);

  const _onDragEnd = (e: MouseEvent) => {
    e.preventDefault();

    boardManagerDispatch({ type: ActionTypes.SET_FINISH_NODE });
    setIsDragged(false);
  };

  return <FinishNode
    draggable={true}
    isDragged={isDragged}
    row={row}
    col={col}
    id={key}
    key={`finish-node-${key}`}
    onDragStart={() => setIsDragged(true)}
    onDragEnd={(e: MouseEvent) => _onDragEnd(e)}
  />
};

export default Finish;