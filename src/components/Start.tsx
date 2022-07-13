import React, { useState } from 'react';
import styled from 'styled-components'
import { NodeBase} from '../global';
import { ITargetNode } from '../interfaces/Cell.interface';
import { ActionTypes } from '../App';

const StartNode = styled.div<any>`
  ${NodeBase};
  background-color:green;
  cursor:move;

  opacity: ${(props: any) => props.isDragged ? .5 : 1};
  
  :hover{
    transform:scale(1.2);
  } 
  `;

function Start({ row, col, dispatch }: ITargetNode) {
  const key: string = `${row}-${col}`;

  const [isDragged, setIsDragged] = useState(false);

  const _onDragEnd = async (e: MouseEvent) => {
    e.preventDefault();

    dispatch({ type: ActionTypes.SET_START_NODE });
    setIsDragged(false);
  }

  return <StartNode
    draggable={true}
    isDragged={isDragged}
    row={row}
    col={col}
    id={key}
    key={`start-node-${key}`}
    onDragStart={() => setIsDragged(true)}
    onDragEnd={(e: MouseEvent) => _onDragEnd(e)}
  />
}

export default Start;