import React from 'react';
import styled from 'styled-components'
import { NodeBase } from '../global';
import { INode } from '../interfaces/Cell.interface';
import { ActionTypes } from './BoardManager';
import { useBoardContext, useBoardUpdateContext } from './BoardContext';


const WallCell = styled.div<any>`
${NodeBase};
background-color:black;
transition: background-color 0.5s ease-out ;
`;


function Wall({ row, col, dispatch }: INode) {
  const boardContext = useBoardContext();
  const { handleWallDrawingEvent, handleUnmarkEvent } = useBoardUpdateContext();
  
  const key: string = `${row}-${col}`;

  const onDragOver = (e: MouseEvent) => {
    e.preventDefault();
    dispatch({ type: ActionTypes.SET_DRAGGED_NODE_POSITION, payload: { row, col } })
  }

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();

    if (boardContext.isDrawingWallAction) {
      if (e.button === 0) {
        dispatch({ type: ActionTypes.SET_WALL_START_NODE, payload: { row, col } });
      } else if (e.button === 2) {
        handleWallDrawingEvent();
        dispatch({ type: ActionTypes.STOP_WALL_SELECTION });
      }
    } else {
      if (e.button === 0) {
        dispatch({ type: ActionTypes.UNMARK_WALL_NODE, payload: { row, col } });
      } else if (e.button === 2) {
        handleWallDrawingEvent();
        handleUnmarkEvent(true);
        dispatch({ type: ActionTypes.SET_UNMARK_WALL_START_NODE, payload: { row, col } });
      }
    }
  }

  return <WallCell
    row={row}
    col={col}
    id={key}
    key={`wall-node-${key}`}
    onDragOver={(e: MouseEvent) => { onDragOver(e) }}
    onContextMenu={(e: MouseEvent) => handleClick(e)}
    onClick={(e: MouseEvent) => handleClick(e)}
    onMouseEnter={(e: MouseEvent) => dispatch({ type: ActionTypes.GENERATE_PROPOSAL_WALL, payload: { node: { row, col },isUnmarkWallAction: boardContext.isUnmarkWallAction } })}
  />
}

export default Wall;