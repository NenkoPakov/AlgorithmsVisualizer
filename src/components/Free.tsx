import React from 'react';
import styled from 'styled-components'
import { NodeBase, NodeText } from '../global';
import { IFreeNode, } from '../interfaces/Cell.interface';
import { ActionTypes } from './Board';
import { useBoard, useBoardUpdate } from './BoardContext';

const FreeNode = styled.div<any>`
${NodeBase};
${NodeText}
background-color:${(props: IFreeNode) => props.isVisited
    ? 'yellow'
    : props.isPartOfThePath
      ? 'white'
      : 'lightblue'};
box-sizing: border-box;
outline:${(props: IFreeNode) => props.isFrontier ? 'solid 0.5px blue' : ''};
transition: background-color 1.5s ease-out ;

:hover{
  background-color:black ;
} 
`;

function Free({ value, row, col, isVisited, isFrontier, isPartOfThePath, dispatch }: IFreeNode) {
  const { isDrawingWall, isUnmarkAction } = useBoard();
  const { handleWallDrawingEvent, handleUnmarkEvent, } = useBoardUpdate();

  const key: string = `${row}-${col}`;

  const onDragOver = (e: MouseEvent) => {
    e.preventDefault();
    dispatch({ type: ActionTypes.SET_DRAGGED_NODE_POSITION, payload: { row, col } });
  }

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();

    if (isDrawingWall) {
      if (e.button === 0) {
        dispatch({ type: ActionTypes.UNMARK_WALL_NODE, payload: { row, col } });
      } else if (e.button === 2) {
        handleWallDrawingEvent();
        dispatch({ type: ActionTypes.STOP_WALL_SELECTION });
      }
    } else {
      if (e.button === 0) {
        dispatch({ type: ActionTypes.SET_WALL_NODE, payload: { row, col } });
      } else if (e.button === 2) {
        handleWallDrawingEvent();
        handleUnmarkEvent(false);
        dispatch({ type: ActionTypes.SET_WALL_START_NODE, payload: { row, col } });
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
    onMouseEnter={() => dispatch({ type: ActionTypes.GENERATE_PROPOSAL_WALL, payload: { node: { row, col }, isUnmarkAction } })}
  >
    {value}
  </FreeNode>

};

export default Free;