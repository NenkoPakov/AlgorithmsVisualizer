import React, { useCallback, useEffect, useRef, useState } from 'react';
import RangeSlider from '../components/RangeSlider';
import breadthFirstSearch from '../services/breadthFirstSearch';
import greedyBestFirstSearch from '../services/greedyBestFirstSearch';
import styled from 'styled-components';
import { useBoardContext, useBoardUpdateContext } from '../components/BoardContext';
import { SliderType } from '../interfaces/Slider.interface';
import Settings from '../components/Settings';
import Actions from '../components/Actions';
import { Node } from '../interfaces/Cell.interface';
import { ActionTypes as ContextActionTypes } from './BoardContext';
import { getMatrixInitValue, splitNodePosition, matrixDeepCopy, updateMatrixRows, updateMatrixCols } from '../global'
import Board from './Board';
import { Algorithms } from '../services/common';
import Card from './Card';
import CardContainer from './CardContainer';
import CircularProgressBar from './CircularProgressBar';

const MainPage = styled.div`
  position:fixed;
  width:100%;
  height:100%;
  background-color:#4251f1;
  display:flex;
  flex-direction:row;
`;

const BoardContainer = styled.section`
  position:relative;
  background-color: #ececec;
  border-radius:40px 0 0 40px;
  display:flex;
  flex-grow:1;
  flex-direction:column;
  justify-content:space-around;
  padding:40px;
  gap:10px 0;
  `;

const Dropdown = styled.div<any>`
  width: 100%;
  position: relative;
  display: inline-block;

  button {
    border: solid black 2px;
    border-radius:10px;
    padding: 0;
    width: 100%;
    border: 0;
    background-color: #bdb5b571;
    color: #333;
    cursor: pointer;
    outline: 0;
    font-size: 40px;
  }

  ul {
    display:${(props: any) => props.isDropdownOpened ? 'block' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 2;
    border: 1px solid rgba(0, 0, 0, 0.04);
    box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14);

    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 8px 12px;
  }

  li:hover {
    background-color: rgba(0, 0, 0, 0.14);
    cursor: pointer;
  }
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
    RESET: 'reset',
}

function reducer(state: State, action: any) {
    switch (action.type) {
        case ActionTypes.SET_BOARD_ROWS:
            if (state.startNode.row >= action.payload) {
                state.startNode = { row: action.payload - 1, col: state.startNode.col };
            }

            if (state.finishNode.row >= action.payload) {
                state.finishNode = { row: action.payload - 1, col: state.finishNode.col };
            }

            // return { ...state, boardRows: action.payload, wallNodes: getMatrixInitValue(action.payload, state.boardCols) as boolean[][] };
            return { ...state, boardRows: action.payload, wallNodes: updateMatrixRows(action.payload, state.boardRows, state.wallNodes, false) as boolean[][] };
        case ActionTypes.SET_BOARD_COLS:
            if (state.startNode.col >= action.payload) {
                state.startNode = { row: state.startNode.row, col: action.payload - 1 };
            }

            if (state.finishNode.col >= action.payload) {
                state.finishNode = { row: state.finishNode.row, col: action.payload - 1 };
            }

            // return { ...state, boardCols: action.payload, wallNodes: getMatrixInitValue(state.boardRows, action.payload) as boolean[][] };
            return { ...state, boardCols: action.payload, wallNodes: updateMatrixCols(action.payload, state.boardCols, state.wallNodes, false) as boolean[][] };

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
            if (state.wallSelectionStartNode.row == -1 || state.wallSelectionStartNode.col == -1) {
                return state;
            }

            //unmark previously proposed wall
            if (state.proposedWall.length) {
                state.proposedWall.map(node => state.wallNodes[node.row][node.col] = false);
            }

            const changedNodes: Node[] = generateWall(action.payload.node, state.wallSelectionStartNode, state.wallNodes);

            changedNodes.map(node => state.wallNodes[node.row][node.col] = action.payload.isUnmarkWallAction ? false : true);
            return { ...state, proposedWall: changedNodes, wallNodeMatrix: state.wallNodes };

        default:
            return state;
    }
}


function BoardManager() {
    const MIN_SIZE = 15;
    const MAX_SIZE = 30;
    const SIZE_RATIO = MAX_SIZE - MIN_SIZE;
    const INITIAL_SIZE = 15;
    const INITIAL_SIZE_SLIDER_DEFAULT_VALUE = 0;
    const INITIAL_TIMEOUT_MILLISECONDS = 80;
    const INITIAL_ITERATION = 0;

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
    const lastIterationIndex = useRef<number>(INITIAL_ITERATION);

    const [isDropdownOpened, setIsDropdownOpened] = useState(false);

    const boardContext = useBoardContext();
    const boardUpdateContext = useBoardUpdateContext();



    const handleSliderUpdate = (sliderValue: number, sliderType: SliderType) => {
        const newSize = MIN_SIZE + Math.ceil(SIZE_RATIO * sliderValue / 100);

        console.log('sliderValue: ' + sliderValue)
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
            case SliderType.progressSlider:
                const maxIterationsCount = Math.max(...Object.values(boardContext.boards).map((board: any) => board.iterationsCount));
                const targetIteration = Math.ceil(maxIterationsCount * sliderValue / 100);

                Object.keys(boardContext.boards).forEach((algorithmKey: any) => {
                    boardUpdateContext.dispatch({ type: ContextActionTypes.JUMP_AT_INDEX, payload: { algorithmKey, targetIteration } })
                })

                lastIterationIndex.current = targetIteration;

                break;

            default:
                //throw exception
                break;
        }
    };

    const delayFunc = useCallback(async () => {
        return new Promise(resolve => setTimeout(resolve, speed.current));
    }, [speed]);

    useEffect(() => {
        let rowsPerBoard = Math.floor(state.boardRows / Object.keys(boardContext.boards).length);
        dispatch({ type: ActionTypes.SET_BOARD_ROWS, payload: Math.max(rowsPerBoard, MIN_SIZE) })
    }, [Object.keys(boardContext.boards).length])


    var boardsValues: { iterationsCount: number, currentIteration: number }[] = Object.values(boardContext.boards);
    let slowestBoardData = boardsValues.reduce((largestBoard, currentBoard) => largestBoard.iterationsCount > currentBoard.iterationsCount ? largestBoard : currentBoard);

    return (
        <MainPage>
            <Settings>
                <div>
                    <RangeSlider key='range-slider-rows' defaultValue={INITIAL_SIZE_SLIDER_DEFAULT_VALUE} sliderType={SliderType.rowsSlider} updateBoardSizeFunc={handleSliderUpdate} />
                    <RangeSlider key='range-slider-cols' defaultValue={INITIAL_SIZE_SLIDER_DEFAULT_VALUE} sliderType={SliderType.colsSlider} updateBoardSizeFunc={handleSliderUpdate} />
                    <RangeSlider key='range-slider-speed' defaultValue={speed.current} sliderType={SliderType.speedSlider} updateBoardSizeFunc={handleSliderUpdate} />
                    <RangeSlider key='range-slider-progress' defaultValue={INITIAL_ITERATION} sliderType={SliderType.progressSlider} updateBoardSizeFunc={handleSliderUpdate} />

                    <Dropdown isDropdownOpened={isDropdownOpened}>
                        <button type="button" onClick={() => setIsDropdownOpened(!isDropdownOpened)}>
                            ALGORITHMS:
                            {Object.keys(boardContext.boards).map(algorithm => <div>{algorithm}</div>)}
                        </button>
                        <ul>
                            {
                                Object.keys(Algorithms).map((algorithm: string) =>
                                    <li onClick={() => { boardUpdateContext.dispatch({ type: boardContext.boards.hasOwnProperty(algorithm) ? ContextActionTypes.REMOVE_BOARD : ContextActionTypes.ADD_BOARD, payload: algorithm }) }}>
                                        <input type="checkbox" value={algorithm} checked={boardContext.boards.hasOwnProperty(algorithm)} />
                                        {algorithm}
                                    </li>)
                            }
                        </ul>
                    </Dropdown>
                </div>
                <Actions delayFunc={delayFunc} />
            </Settings>
            <BoardContainer>
                <CardContainer>
                    <Card title="Rows count" data={state.boardRows}></Card>
                    <Card title="Cols count" data={state.boardCols}></Card>
                    <Card title="Status" data={
                        boardContext.isPaused
                            ? "Paused"
                            : boardContext.isInExecution
                                ? "Running"
                                // : slowestBoardData.currentIteration > 0 && slowestBoardData.currentIteration < slowestBoardData.iterationsCount
                                : "Ready"
                    } />
                    {slowestBoardData.currentIteration > 0 && <Card title="Operations count" data={slowestBoardData.currentIteration} />}
                    {/* {slowestBoardData.currentIteration > 0 && */}
                    <Card title="Progress" data={`${Math.round(100 / (slowestBoardData.iterationsCount / slowestBoardData.currentIteration))}%`}>
                    </Card>
                    {/* } */}
                    <CircularProgressBar progressInPercentages={Math.round(100 / (slowestBoardData.iterationsCount / slowestBoardData.currentIteration))}></CircularProgressBar>
                </CardContainer>

                {Object.keys(boardContext.boards).map((key: string) =>
                    <Board
                        boardRows={state.boardRows}
                        boardCols={state.boardCols}
                        wallNodes={state.wallNodes}
                        startNode={state.startNode}
                        finishNode={state.finishNode}
                        algorithmKey={key as keyof typeof Algorithms}
                        parentDispatch={dispatch}
                    />
                )}
            </BoardContainer>
        </MainPage>
    )
}

export default BoardManager