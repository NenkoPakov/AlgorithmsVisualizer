import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components'
import { CellBase, CellText } from '../global';
import { ICell } from '../interfaces/Cell.interface';
import { ActionTypes } from './Board';


const FinishNode = styled.div<any>`
${CellBase};
background-color:blue;
cursor:move;

opacity: ${(props: any) => props.isDragged?.5:1};

:hover{
  transform:scale(1.2);
} 
`;

const Finish = ({ row, col, dispatch }: ICell) => {
  const key: string = `${row}-${col}`;

  const [isDragged, setIsDragged] = useState(false);

  const _onDragEnd = (e: MouseEvent) => {
    e.preventDefault();

    dispatch({ type: ActionTypes.SET_FINISH_NODE });
    setIsDragged(false);
  }
  
  useEffect(() => {
    console.log(isDragged);
  }, [isDragged])

  return <FinishNode
    draggable={true}
    isDragged={isDragged}
    row={row}
    col={col}
    id={key}
    key={`finish-node-${key}`}
    onDragStart={() => setIsDragged(true)}
    onDragEnd={(event: MouseEvent) => _onDragEnd(event)}
  />

};

export default Finish;