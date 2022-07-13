import React, { useState } from 'react';
import styled from 'styled-components'
import { NodeBase } from '../global';
import {  ITargetNode } from '../interfaces/Cell.interface';
import { ActionTypes } from '../App';


const FinishNode = styled.div<any>`
${NodeBase};
background-color:blue;
cursor:move;

opacity: ${(props: any) => props.isDragged?.5:1};

:hover{
  transform:scale(1.2);
} 
`;

const Finish = ({ row, col, dispatch }: ITargetNode) => {
  const key: string = `${row}-${col}`;

  const [isDragged, setIsDragged] = useState(false);

  const _onDragEnd = (e: MouseEvent) => {
    e.preventDefault();

    dispatch({ type: ActionTypes.SET_FINISH_NODE });
    setIsDragged(false);
  }

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