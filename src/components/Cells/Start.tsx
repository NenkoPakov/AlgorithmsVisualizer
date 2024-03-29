import React, { useState } from 'react';
import styled from 'styled-components'
import { BackgroundColorType, NodeBase} from '../../global';
import { BaseProps } from '../../interfaces/Cell.interface';
import { ActionTypes } from './../BoardManager';

const StartNode = styled.div<any>`
  ${NodeBase};
  flex-basis:${(props: BaseProps)=>props.sideLength};
  aspect-ratio:1;
  cursor:move;
  background-color:${BackgroundColorType.Green};
  opacity: ${(props: {isDragged:boolean}) => props.isDragged ? .5 : 1};
  
  :hover{
    transform:scale(1.2);
  } 
`;

function Start({sideLength, row, col, boardManagerDispatch }: BaseProps) {
  const key: string = `${row}-${col}`;

  const [isDragged, setIsDragged] = useState(false);

  const _onDragEnd = async (e: MouseEvent):Promise<void> => {
    e.preventDefault();

    boardManagerDispatch({ type: ActionTypes.SET_START_NODE });
    setIsDragged(false);
  };

  return <StartNode
  sideLength={sideLength}
    draggable={true}
    isDragged={isDragged}
    row={row}
    col={col}
    id={key}
    key={`start-node-${key}`}
    onDragStart={() => setIsDragged(true)}
    onDragEnd={(e: MouseEvent) => _onDragEnd(e)}
  />
};

export default Start;