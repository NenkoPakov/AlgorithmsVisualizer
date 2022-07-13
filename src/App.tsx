import Board from './components/Board'
import './App.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import RangeSlider from './components/RangeSlider';
import breadthFirstSearch from './services/breadthFirstSearch';
import greedyBestFirstSearch from './services/greedyBestFirstSearch';
import styled from 'styled-components';
import BoardProvider from './components/BoardContext';
import { SliderType } from './interfaces/Slider.interface';
import Settings from './components/Settings';
import Button from './components/Button';
import Actions from './components/Actions';
import { Node } from './interfaces/Cell.interface';
import { getMatrixInitValue, splitNodePosition, matrixDeepCopy } from './global'

const Layout = styled.div`
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  padding: 10px;
  `;

const BoardContainer = styled.section`
  height:calc(100vh - 2*10px);
  display:flex;
  flex-grow:1;
  flex-direction:column;
  justify-content:space-around;
  margin:0 20px;
  gap:10px 0;
  `;

const generateWall = (targetNode: Node, wallStartNode: Node, wallNodes: boolean[][]) => {
  const proposedNodes: Node[] = [];

  let { row: targetRow, col: targetCol } = targetNode;
  let { row: previousNodeRow, col: previousNodeCol } = wallStartNode;

  let verticalDirectionSign = previousNodeRow > targetRow ? -1 : +1;
  let horizontalDirectionSign = previousNodeCol > targetCol ? -1 : +1;

  while (previousNodeRow != targetRow && previousNodeCol != targetCol) {
    previousNodeRow += verticalDirectionSign;
    previousNodeCol += horizontalDirectionSign;

    if (!wallNodes[previousNodeRow][previousNodeCol]) {
      proposedNodes.push({ row: previousNodeRow, col: previousNodeCol });
    }
  }

  while (previousNodeRow != targetRow) {
    previousNodeRow += verticalDirectionSign;

    if (!wallNodes[previousNodeRow][previousNodeCol]) {
      proposedNodes.push({ row: previousNodeRow, col: previousNodeCol });
    }
  }

  while (previousNodeCol != targetCol) {
    previousNodeCol += horizontalDirectionSign;

    if (!wallNodes[previousNodeRow][previousNodeCol]) {
      proposedNodes.push({ row: previousNodeRow, col: previousNodeCol });
    }
  }

  return proposedNodes;
}

interface State {
  boardRows: number,
  boardCols: number,
  startNode: Node,
  finishNode: Node,
  wallNodes: boolean[][],
  wallSelectionStartNode: Node,
  proposedWall: Node[],
  draggedNodePosition: Node,
}

export const ActionTypes = {
  SET_BOARD_ROWS: 'setBoardRows',
  SET_BOARD_COLS: 'setBoardCols',
  SET_WALL_START_NODE: 'setWallStartNode',
  SET_DRAGGED_NODE_POSITION: 'setDraggedNodePosition',
  SET_START_NODE: 'setStartNode',
  SET_FINISH_NODE: 'setFinishNode',
  SET_UNMARK_WALL_START_NODE: 'setUnmarkWallStartNode',
  STOP_WALL_SELECTION: 'stopWallSelection',
  GENERATE_PROPOSAL_WALL: 'generateProposalWall',
  SET_WALL_NODE: 'setWallNode',
  UNMARK_WALL_NODE: 'unmarkWallNode',
}

function reducer(state: State, action: any) {
  switch (action.type) {
    case ActionTypes.SET_BOARD_ROWS:
      return { ...state, boardRows: action.payload, wallNodes: getMatrixInitValue(action.payload,state.boardCols) as boolean[][] };
    case ActionTypes.SET_BOARD_COLS:
      return { ...state, boardCols: action.payload, wallNodes: getMatrixInitValue(state.boardRows,action.payload) as boolean[][]  };

    case ActionTypes.SET_DRAGGED_NODE_POSITION:
      if (state.draggedNodePosition.row != action.payload.row || state.draggedNodePosition.col != action.payload.col) {
        return { ...state, draggedNodePosition: action.payload };
      }

      return state;

    case ActionTypes.SET_START_NODE:
      return { ...state, startNode: state.draggedNodePosition };

    case ActionTypes.SET_FINISH_NODE:
      return { ...state, finishNode: state.draggedNodePosition, wallNodes: state.wallNodes };

    case ActionTypes.SET_WALL_NODE:
      let { row: wallNodeRow, col: wallNodeCol } = action.payload;
      state.wallNodes[wallNodeRow][wallNodeCol] = true;

      return { ...state, wallNodes: state.wallNodes };
    case ActionTypes.UNMARK_WALL_NODE:
      let { row: unmarkWallRow, col: unmarkWallCol } = action.payload;
      state.wallNodes[unmarkWallRow][unmarkWallCol] = false;

      return { ...state, wallNodes: state.wallNodes };

    case ActionTypes.SET_WALL_START_NODE:
      let { row: wallStartRow, col: wallStartCol } = action.payload;

      if (state.wallSelectionStartNode.row == wallStartRow && state.wallSelectionStartNode.col == wallStartCol) {
        return { ...state, wallSelectionStartNode: { row: -1, col: -1 } };
      }

      if (state.proposedWall.length) {
        return { ...state, wallSelectionStartNode: action.payload, proposedWall: [] };
      }

      state.wallNodes[wallStartRow][wallStartCol] = true;

      return { ...state, wallSelectionStartNode: action.payload, wallNodes: state.wallNodes };

    case ActionTypes.SET_UNMARK_WALL_START_NODE:
      let { row: unmarkWallStartRow, col: unmarkWallStartCol } = action.payload;

      if (state.wallSelectionStartNode.row == unmarkWallStartRow && state.wallSelectionStartNode.col == unmarkWallStartCol) {
        return { ...state, wallSelectionStartNode: { row: -1, col: -1 } };
      }

      if (state.proposedWall.length) {
        return { ...state, wallSelectionStartNode: action.payload, proposedWall: [] };
      }

      state.wallNodes[unmarkWallStartRow][unmarkWallStartCol] = false;

      return { ...state, wallSelectionStartNode: action.payload, wallNodes: state.wallNodes };

    case ActionTypes.STOP_WALL_SELECTION:
      return { ...state, wallSelectionStartNode: { row: -1, col: -1 }, proposedWall: [] };

    case ActionTypes.GENERATE_PROPOSAL_WALL:
      //unmark previously proposed wall
      if (state.proposedWall.length) {
        state.proposedWall.map(node => state.wallNodes[node.row][node.col] = false);
      }

      if (state.wallSelectionStartNode.row != -1 && state.wallSelectionStartNode.col != -1) {
        const changedNodes: Node[] = generateWall(action.payload.node, state.wallSelectionStartNode, state.wallNodes);

        changedNodes.map(node => state.wallNodes[node.row][node.col] = action.payload.isUnmarkAction ? false : true);
        return { ...state, proposedWall: changedNodes, wallNodeMatrix: state.wallNodes };
      }

    default:
      return state;
  }
}

function App() {
  const MIN_SIZE = 15;
  const MAX_SIZE = 45;
  const SIZE_RATIO = MAX_SIZE - MIN_SIZE;
  const INITIAL_SIZE = 15;
  const INITIAL_TIMEOUT_MILLISECONDS = 80;

  const initState = {
    boardRows: INITIAL_SIZE,
    boardCols: INITIAL_SIZE,
    startNode: { row: 0, col: 0 },
    finishNode: { row: INITIAL_SIZE - 1, col: INITIAL_SIZE - 1 },
    wallNodes: getMatrixInitValue(INITIAL_SIZE, INITIAL_SIZE) as boolean[][],
    wallSelectionStartNode: { row: -1, col: -1 },
    proposedWall: [],
    draggedNodePosition: { row: -1, col: -1 },
  }

  const [state, dispatch] = React.useReducer(reducer, initState);
  const speed = useRef<number>(INITIAL_TIMEOUT_MILLISECONDS);


  const handleSliderUpdate = (sliderValue: number, sliderType: SliderType) => {
    const newSize = MIN_SIZE + Math.ceil(SIZE_RATIO * sliderValue / 100);

    switch (sliderType) {
      case SliderType.rowsSlider:
        dispatch({ type: ActionTypes.SET_BOARD_ROWS, payload: newSize })
        break;
      case SliderType.colsSlider:
        dispatch({ type: ActionTypes.SET_BOARD_COLS, payload: newSize })
        break;
      case SliderType.speedSlider:
        speed.current = sliderValue * 2;
        break;
      default:
        //throw exception
        break;
    }
  };

  const delayFunc = useCallback(async () => {
    return new Promise(resolve => setTimeout(resolve, speed.current));
  }, [speed])

  return (
    <Layout>
      <BoardProvider>
        <BoardContainer>
          <Board 
              boardRows={state.boardRows} 
              boardCols={state.boardCols} 
              wallNodes={state.wallNodes} 
              startNode={state.startNode} 
              finishNode={state.finishNode} 
              recentlyVisitedNodes={[]} 
              algorithmFunc={breadthFirstSearch}
              delayFunc={delayFunc}
              parentDispatch={dispatch}/>
          <Board 
              boardRows={state.boardRows} 
              boardCols={state.boardCols} 
              wallNodes={state.wallNodes} 
              startNode={state.startNode} 
              finishNode={state.finishNode} 
              recentlyVisitedNodes={[]} 
              algorithmFunc={greedyBestFirstSearch}
              delayFunc={delayFunc}
              parentDispatch={dispatch}/>
        </BoardContainer>
        <Settings>
          <div>
            <RangeSlider key='range-slider-rows' boardSize={state.boardRows} sliderType={SliderType.rowsSlider} updateBoardSizeFunc={handleSliderUpdate} />
            <RangeSlider key='range-slider-cols' boardSize={state.boardCols} sliderType={SliderType.colsSlider} updateBoardSizeFunc={handleSliderUpdate} />
            <RangeSlider key='range-slider-speed' boardSize={speed.current} sliderType={SliderType.speedSlider} updateBoardSizeFunc={handleSliderUpdate} />
          </div>
          <Actions />
        </Settings>
      </BoardProvider>
    </Layout>
  );
}

export default App;
