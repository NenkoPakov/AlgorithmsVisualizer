import React from 'react';
import styled from 'styled-components'
import { BackgroundColorType, NodeBase } from '../../global';
import { BaseProps } from '../../interfaces/Cell.interface';
import { ActionTypes } from './../BoardManager';
import { ActionTypes as ContextActionTypes } from './../BoardContext';
import { useBoardContext, useBoardUpdateContext } from './../BoardContext';

const WallCell = styled.div<any>`
  ${NodeBase};
  max-height:${(props: BaseProps)=>props.sideLength};
  aspect-ratio:1;
  background-color:${BackgroundColorType.Brown};
  transition: background-color 0.5s ease-out ;
`;

function Wall({ sideLength, row, col, boardManagerDispatch }: BaseProps) {
  const boardContext = useBoardContext();
  const boardUpdateContext = useBoardUpdateContext();

  const key: string = `${row}-${col}`;

  const onDragOver = (e: MouseEvent): void => {
    e.preventDefault();
    boardManagerDispatch({ type: ActionTypes.SET_DRAGGED_NODE_POSITION, payload: { row, col } })
  };

  const handleClick = (e: MouseEvent): void => {
    e.preventDefault();

    if (boardContext.isDrawingWallAction) {
      if (e.button === 0) {
        boardManagerDispatch({ type: ActionTypes.SET_WALL_START_NODE, payload: { row, col } });
      } else if (e.button === 2) {
        boardUpdateContext.dispatch({ type: ContextActionTypes.STOP_DRAWING_WALL_ACTION });
        boardManagerDispatch({ type: ActionTypes.STOP_WALL_SELECTION });
      }
    } else {
      if (e.button === 0) {
        boardManagerDispatch({ type: ActionTypes.UNMARK_WALL_NODE, payload: { row, col } });
      } else if (e.button === 2) {
        boardUpdateContext.dispatch({ type: ContextActionTypes.START_UNMARK_WALL_ACTION });
        boardManagerDispatch({ type: ActionTypes.SET_UNMARK_WALL_START_NODE, payload: { row, col } });
      }
    }
  };

  return <WallCell
    sideLength={sideLength}
    row={row}
    col={col}
    id={key}
    key={`wall-node-${key}`}
    onDragOver={(e: MouseEvent) => { onDragOver(e) }}
    onContextMenu={(e: MouseEvent) => handleClick(e)}
    onClick={(e: MouseEvent) => handleClick(e)}
    onMouseEnter={(e: MouseEvent) => boardManagerDispatch({ type: ActionTypes.GENERATE_PROPOSAL_WALL, payload: { node: { row, col }, isUnmarkWallAction: boardContext.isUnmarkWallAction } })}
  />
};

export default Wall;