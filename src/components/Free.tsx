import React from 'react';
import styled from 'styled-components'
import { NodeBase, NodeText } from '../global';
import { IFreeNode, } from '../interfaces/Cell.interface';
import { ActionTypes } from './BoardManager';
import { ActionTypes as ContextActionTypes } from './BoardContext';
import { useBoardContext, useBoardUpdateContext } from './BoardContext';

const FreeNode = styled.div<any>`
${NodeBase};
${NodeText};
resize:none;
background-color:${(props: IFreeNode) => props.isVisited
    ? '#95b9f4'
    : props.isPartOfThePath
      ? 'white'
      : '#c5c5c5'};
box-sizing: border-box;
outline:${(props: IFreeNode) => props.isFrontier ? 'solid 0.5px blue' : ''};
transition: background-color 1.5s ease-out ;

:hover{
  background-color:black ;
} 
`;

function Free({ value, row, col, isVisited, isFrontier, isPartOfThePath, boardManagerDispatch }: IFreeNode) {
  const boardContext = useBoardContext();
  const boardUpdateContext = useBoardUpdateContext();

  const key: string = `${row}-${col}`;

  const onDragOver = (e: MouseEvent) => {
    e.preventDefault();
    boardManagerDispatch({ type: ActionTypes.SET_DRAGGED_NODE_POSITION, payload: { row, col } });
  }

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();

    if (boardContext.isDrawingWallAction) {
      if (e.button === 0) {
        boardManagerDispatch({ type: ActionTypes.UNMARK_WALL_NODE, payload: { row, col } });
      } else if (e.button === 2) {
        boardUpdateContext.dispatch({ type: ContextActionTypes.STOP_DRAWING_WALL_ACTION });
        boardManagerDispatch({ type: ActionTypes.STOP_WALL_SELECTION });
      }
    } else {
      if (e.button === 0) {
        boardManagerDispatch({ type: ActionTypes.SET_WALL_NODE, payload: { row, col } });
      } else if (e.button === 2) {
        boardUpdateContext.dispatch({ type: ContextActionTypes.START_DRAWING_WALL_ACTION });
        boardUpdateContext.dispatch({ type: ContextActionTypes.STOP_UNMARK_WALL_ACTION });
        boardManagerDispatch({ type: ActionTypes.SET_WALL_START_NODE, payload: { row, col } });
      }
    }
  }

  return <FreeNode
    id={key}
    key={`free-node-${key}`}
    isVisited={isVisited}
    isFrontier={isFrontier}
    isPartOfThePath={isPartOfThePath}
    onDragOver={(e: MouseEvent) => onDragOver(e)}
    onContextMenu={(e: MouseEvent) => handleClick(e)}
    onClick={(e: MouseEvent) => handleClick(e)}
    onMouseEnter={() => boardManagerDispatch({ type: ActionTypes.GENERATE_PROPOSAL_WALL, payload: { node: { row, col }, isUnmarkWallAction: boardContext.isUnmarkWallAction } })}
  >
    {/* {key} */}
    {value}
  </FreeNode>

};

export default Free;