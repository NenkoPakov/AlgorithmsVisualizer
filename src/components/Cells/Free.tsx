import React from 'react';
import styled from 'styled-components'
import { BackgroundColorType, NodeBase, NodeText } from '../../global';
import { FreeProps, } from '../../interfaces/Cell.interface';
import { ActionTypes } from '../BoardManager';
import { ActionTypes as ContextActionTypes } from '../BoardContext';
import { useBoardContext, useBoardUpdateContext } from '../BoardContext';

const FreeNode = styled.div<any>`
  ${NodeBase};
  ${NodeText};
  flex-basis:${(props: FreeProps)=>props.sideLength};
  aspect-ratio:1;
  /* resize:none; */
  background-color:${(props: FreeProps) => props.isVisited
    ? BackgroundColorType.Blue
    : props.isPartOfThePath
      ? BackgroundColorType.Gold
      : BackgroundColorType.Gray};
  /* box-sizing: border-box; */
  outline:${(props: FreeProps) => props.isFrontier ? 'solid 0.5px blue' : 'unset'};
  transition: background-color 1.5s ease-out ;

  :hover{
    background-color:${BackgroundColorType.Brown} ;
  } 
`;

function Free({ value, sideLength, row, col, isVisited, isFrontier, isPartOfThePath, boardManagerDispatch }: FreeProps) {
  const boardContext = useBoardContext();
  const boardUpdateContext = useBoardUpdateContext();

  const key: string = `${row}-${col}`;

  const onDragOver = (e: MouseEvent): void => {
    e.preventDefault();
    boardManagerDispatch({ type: ActionTypes.SET_DRAGGED_NODE_POSITION, payload: { row, col } });
  }

  const handleClick = (e: MouseEvent): void => {
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
  };

  return <FreeNode
    id={key}
    sideLength={sideLength}
    key={`free-node-${key}`}
    isVisited={isVisited}
    isFrontier={isFrontier}
    isPartOfThePath={isPartOfThePath}
    onDragOver={(e: MouseEvent) => onDragOver(e)}
    onContextMenu={(e: MouseEvent) => handleClick(e)}
    onClick={(e: MouseEvent) => handleClick(e)}
    onMouseEnter={() => boardManagerDispatch({ type: ActionTypes.GENERATE_PROPOSAL_WALL, payload: { node: { row, col }, isUnmarkWallAction: boardContext.isUnmarkWallAction } })}
  >
    {/* {value} */}
  </FreeNode>
};

export default Free;