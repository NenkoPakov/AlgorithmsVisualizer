import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useBoardContext } from '../components/BoardContext';
import Settings from '../components/Settings/Settings';
import { Node } from '../interfaces/Cell.interface';
import { getMatrixInitValue, updateMatrixRows, updateMatrixCols, Algorithm, BackgroundColorType } from '../global'
import Board from './Board';
import { DelayType, State } from '../interfaces/BoardManager.interface';
import CardManager from './Metrics/CardManager';

const MainPage = styled.div`
  position:fixed;
  width:100%;
  height:100%;
  background-color:${BackgroundColorType.Beige};
  display:flex;
  flex-direction:row;
`;

const SectionBase = styled.section`
  position:relative;
  background-color: ${BackgroundColorType.SmokedWhite};
  display:flex;
  flex-grow:1;
  flex-direction:column;
  gap:10px 0;
`;

const VisualizationContainer = styled(SectionBase)`
padding:40px;
`;

const BoardsContainer = styled(SectionBase)`
overflow-y:auto;
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
    SET_DELAY: 'setDelay',
    UNMARK_WALL_NODE: 'unmarkWallNode',
    RESET: 'reset',
};

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

        case ActionTypes.SET_DELAY:
            return { ...state, delay: action.payload };

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
    const INITIAL_SIZE = 15;
    const INITIAL_TIMEOUT_MILLISECONDS = 80;
    const MIN_SIZE = 15;

    const getDelayType = (value: number): string => {
        const smallThreshold = 100 / 3;
        const normalThreshold = smallThreshold * 2;
        return value < smallThreshold ? DelayType[DelayType.small] : value < normalThreshold ? DelayType[DelayType.medium] : DelayType[DelayType.large];
    };

    const initState = {
        boardRows: INITIAL_SIZE,
        boardCols: INITIAL_SIZE,
        startNode: { row: 0, col: 0 },
        finishNode: { row: INITIAL_SIZE - 1, col: INITIAL_SIZE - 1 },
        wallNodes: getMatrixInitValue(INITIAL_SIZE, INITIAL_SIZE) as boolean[][],
        wallSelectionStartNode: { row: -1, col: -1 },
        proposedWall: [],
        draggedNodePosition: { row: -1, col: -1 },
        delay: getDelayType(INITIAL_TIMEOUT_MILLISECONDS),
    };

    const [state, dispatch] = React.useReducer(reducer, initState);
    const delay = useRef<number>(INITIAL_TIMEOUT_MILLISECONDS);

    const boardContext = useBoardContext();

    const delayFunc = useCallback(async (): Promise<Function> => {
        return new Promise(resolve => setTimeout(resolve, delay.current));
    }, [delay.current]);


    useEffect(() => {
        if(Object.keys(boardContext.boards).length){
            let rowsPerBoard = Math.floor(state.boardRows / Object.keys(boardContext.boards).length);
            dispatch({ type: ActionTypes.SET_BOARD_ROWS, payload: Math.max(rowsPerBoard, MIN_SIZE) })
        }
    }, [Object.keys(boardContext.boards).length]);


    return (
        <MainPage>
            <Settings boardManagerDispatch={dispatch} delayState={state.delay} delayFunc={delayFunc} delayRef={delay} getDelayTypeFunc={getDelayType} />
            <VisualizationContainer>
                <CardManager rows={state.boardRows} cols={state.boardCols} wallNodes={state.wallNodes} delay={state.delay} />
                {Object.keys(boardContext.boards).length>0 && 
                    Object.keys(boardContext.boards).map((key: string) =>
                        <Board  
                            key={`board-${key}`}
                            boardRows={state.boardRows}
                            boardCols={state.boardCols}
                            wallNodes={state.wallNodes}
                            startNode={state.startNode}
                            finishNode={state.finishNode}
                            algorithmKey={key as keyof typeof Algorithm}
                            boardManagerDispatch={dispatch}
                            delayFunc={delayFunc}
                        />
                    )}
            </VisualizationContainer>
        </MainPage>
    );
};

export default BoardManager

