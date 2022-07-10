import Cell from './Cell';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ComeFrom, ComeFromData, BoardProps } from '../interfaces/Board.interface';
import { Node } from '../interfaces/Cell.interface';
import { useBoard, useBoardUpdate } from './BoardContext';

const BoardSection = styled.section`
position:relative;
display: flex;
flex-direction:column;
width:100%;
height:100%;
`;

const ButtonWrapper = styled.div`
position:relative;
margin:auto;
`;

const BoardWrapper = styled.div`
position:relative;
display: flex;
flex-basis:100%;
flex-direction:column;
border:5px solid black;
gap:1px;
`;

const RowWrapper = styled.div`
width:100%;
position:relative;
display: flex;
flex-basis:100%;
flex-direction:row;
gap:1px;
`;

const getMatrixInitValue = (rows: number, cols: number, isNumeric = false) => {
    let initMatrix: boolean[][] | number[][] = Array(rows);

    for (let row = 0; row < rows; row++) {
        initMatrix[row] = Array(cols);
        for (let col = 0; col < cols; col++) {
            initMatrix[row][col] = isNumeric ? 0 : false;
        }
    }

    return initMatrix
};

const getNumericMatrixInitValue = (size: number) => {
    let initMatrix: number[][] = Array(size);

    for (let row = 0; row < size; row++) {
        initMatrix[row] = Array(size);
        for (let col = 0; col < size; col++) {
            initMatrix[row][col] = 0;
        }
    }

    return initMatrix
};

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

const destroyWall = (targetNode: Node, wallStartNode: Node, wallNodes: boolean[][]) => {
    const destroyedNodes: Node[] = [];

    // let { row: targetRow, col: targetCol } = targetNode;
    // let { row: previousNodeRow, col: previousNodeCol } = wallStartNode;

    // let colDifference = previousNodeCol - targetCol;
    // let rowDifference = previousNodeRow - targetRow;

    // let verticalDirectionSign = rowDifference > 0 ? -1 : +1;
    // let horizontalDirectionSign = colDifference > 0 ? -1 : +1;

    // if(Math.abs(colDifference)>Math.abs(rowDifference)){
    //     previousNodeCol += horizontalDirectionSign;
    // }






    // while (previousNodeRow != targetRow && previousNodeCol != targetCol) {
    //     previousNodeRow += verticalDirectionSign;
    //     previousNodeCol += horizontalDirectionSign;

    //     if (wallNodes[previousNodeRow][previousNodeCol]) {
    //         proposedNodes.push({ row: previousNodeRow, col: previousNodeCol });
    //     }
    // }

    // while (previousNodeRow != targetRow) {
    //     previousNodeRow += verticalDirectionSign;

    //     if (wallNodes[previousNodeRow][previousNodeCol]) {
    //         proposedNodes.push({ row: previousNodeRow, col: previousNodeCol });
    //     }
    // }

    // while (previousNodeCol != targetCol) {
    //     previousNodeCol += horizontalDirectionSign;

    //     if (wallNodes[previousNodeRow][previousNodeCol]) {
    //         proposedNodes.push({ row: previousNodeRow, col: previousNodeCol });
    //     }
    // }

    // return proposedNodes;
}

const matrixDeepCopy = (matrix: boolean[][] | number[][]) => {
    return JSON.parse(JSON.stringify(matrix));
}

// const booleanMatrixDeepCopy = (matrix: boolean[][]) => {
//     return JSON.parse(JSON.stringify(matrix)) as boolean[][];
// }

interface State {
    startNode: Node,
    finishNode: Node,
    wallNodes: boolean[][],
    visitedNodes: boolean[][],
    frontierNodes: boolean[][],
    nodeValues: number[][],
    pathNodes: boolean[][],
    wallSelectionStartNode: Node,
    proposedWall: Node[],
    foundPath: Node[],
    draggedNodePosition: Node,
}

export const ActionTypes = {
    UPDATE_SIZE: 'updateSize',
    CLEAR_MATRIX: 'clearMatrix',
    CLEAR_SOLUTION: 'clearSolution',
    SET_VISITED_NODE: 'setVisitedNode',
    SET_FRONTIER_NODE: 'setFrontierNode',
    SET_PATH_NODE: 'setPathNode',
    SET_NODE_VALUE: 'setNodeValue',
    SET_DRAGGED_NODE_POSITION: 'setDraggedNodePosition',
    SET_START_NODE: 'setStartNode',
    SET_FINISH_NODE: 'setFinishNode',
    SET_WALL_START_NODE: 'setWallStartNode',
    SET_UNMARK_WALL_START_NODE: 'setUnmarkWallStartNode',
    STOP_WALL_SELECTION: 'stopWallSelection',
    SET_PRESSED_CELL_TYPE: 'setPressedCellType',
    GENERATE_PROPOSAL_WALL: 'generateProposalWall',
    SET_WALL_NODE: 'setWallNode',
    UNMARK_WALL_NODE: 'unmarkWallNode',
}

function reducer(state: State, action: any) {
    switch (action.type) {
        case ActionTypes.CLEAR_MATRIX:
            return { ...state, visitedNodes: matrixDeepCopy(action.payload) as boolean[][], frontierNodes: matrixDeepCopy(action.payload) as boolean[][], pathNodes: matrixDeepCopy(action.payload) as boolean[][], wallNodes: matrixDeepCopy(action.payload) as boolean[][] };

        case ActionTypes.UPDATE_SIZE:
            let { booleanMatrix, numericMatrix } = action.payload;
            return { ...state, visitedNodes: matrixDeepCopy(booleanMatrix) as boolean[][], frontierNodes: matrixDeepCopy(booleanMatrix) as boolean[][], pathNodes: matrixDeepCopy(booleanMatrix) as boolean[][], wallNodes: matrixDeepCopy(booleanMatrix) as boolean[][], nodeValues: matrixDeepCopy(numericMatrix) as number[][] };

        case ActionTypes.CLEAR_SOLUTION:
            return { ...state, visitedNodes: matrixDeepCopy(action.payload) as boolean[][], pathNodes: matrixDeepCopy(action.payload) as boolean[][] };

        case ActionTypes.SET_VISITED_NODE:
            let { row: visitedRow, col: visitedCol }: Node = action.payload;
            state.visitedNodes[visitedRow][visitedCol] = true;

            return { ...state, visitedNodes: state.visitedNodes };

        case ActionTypes.SET_FRONTIER_NODE:
            let { row: frontierRow, col: frontierCol }: Node = action.payload;
            state.frontierNodes[frontierRow][frontierCol] = true;

            return { ...state, frontierNodes: state.frontierNodes };

        case ActionTypes.SET_PATH_NODE:
            let { row: pathRow, col: pathCol }: Node = action.payload;

            state.pathNodes[pathRow][pathCol] = !state.pathNodes[pathRow][pathCol];

            return { ...state, pathNodes: state.pathNodes };

        case ActionTypes.SET_NODE_VALUE:
            let { row: nodeValueRow, col: nodeValueCol }: Node = action.payload.frontier;

            state.nodeValues[nodeValueRow][nodeValueCol] = action.payload.value;

            return { ...state, nodeValues: state.nodeValues };

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

        case ActionTypes.SET_PRESSED_CELL_TYPE:
            return { ...state, pressedCellType: action.payload };

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

function Board({ boardRows, boardCols, delayFunc, algorithmFunc }: BoardProps) {


    const initState = {
        startNode: { row: 0, col: 0 },
        finishNode: { row: boardRows - 1, col: boardCols - 1 },
        wallNodes: getMatrixInitValue(boardRows, boardCols) as boolean[][],
        visitedNodes: getMatrixInitValue(boardRows, boardCols) as boolean[][],
        frontierNodes: getMatrixInitValue(boardRows, boardCols) as boolean[][],
        nodeValues: getMatrixInitValue(boardRows, boardCols, true) as number[][],
        pathNodes: getMatrixInitValue(boardRows, boardCols) as boolean[][],
        wallSelectionStartNode: { row: -1, col: -1 },
        proposedWall: [],
        foundPath: [],
        draggedNodePosition: { row: -1, col: -1 },
    }

    const [state, dispatch] = React.useReducer(reducer, initState);

    const { isDrawingWall, isUnmarkAction, isInExecution } = useBoard();
    const { handleWallDrawingEvent, handleUnmarkEvent, handleExecution } = useBoardUpdate();

    useEffect(() => {
        dispatch({ type: ActionTypes.UPDATE_SIZE, payload: { booleanMatrix: getMatrixInitValue(boardRows, boardCols), numericMatrix: getMatrixInitValue(boardRows, boardCols, true) } });
    }, [boardRows, boardCols])

    const executeAlgorithm = async () => {
        handleExecution();
        clearTimers();

        for (const lastComeFrom of algorithmFunc(state.wallNodes, state.startNode, state.finishNode)) {
            const recentlyVisitedNodes: { frontier: Node, parent: Node | undefined, value: number }[] = Object.keys(lastComeFrom).map(currentKey => {
                let frontier = splitNodePosition(currentKey);
                let parent = lastComeFrom[currentKey].parent ? splitNodePosition(lastComeFrom[currentKey].parent!) : undefined;
                let value: number = lastComeFrom[currentKey].value;

                return { frontier, parent, value };
            });

            for (const node of recentlyVisitedNodes) {
                dispatch({ type: ActionTypes.SET_FRONTIER_NODE, payload: node.frontier });
                dispatch({ type: ActionTypes.SET_VISITED_NODE, payload: node.parent });
                dispatch({ type: ActionTypes.SET_NODE_VALUE, payload: node });
            }

            await delayFunc();
        }

        handleExecution();
    };

    const clearMatrix = () => {
        clearTimers();
        dispatch({ type: ActionTypes.CLEAR_MATRIX, payload: getMatrixInitValue(boardRows, boardCols) })
    };

    return (
        <BoardSection>
            <ButtonWrapper>
                <button key={'execute'} onClick={() => executeAlgorithm()}>Execute</button>
                <button key={'clear'} onClick={() => clearMatrix()}>Clear board</button>
            </ButtonWrapper>
            <BoardWrapper>
                {/* visitedNodes is used just for the iteration through all rows and cols */}
                {state.visitedNodes.map((row, rowIndex) => (
                    <RowWrapper>
                        {row.map((_, colIndex) => {
                            let isStartNode = rowIndex === state.startNode.row && colIndex === state.startNode.col;
                            let isFinishNode = rowIndex === state.finishNode.row && colIndex === state.finishNode.col;

                            return <Cell
                                key={`board-cell-${rowIndex}-${colIndex}`}
                                value={state.nodeValues[rowIndex][colIndex]}
                                isVisited={state.visitedNodes[rowIndex][colIndex]}
                                isFrontier={state.frontierNodes[rowIndex][colIndex]}
                                isWall={state.wallNodes[rowIndex][colIndex]}
                                isPartOfThePath={state.pathNodes[rowIndex][colIndex]}
                                isStart={isStartNode}
                                isFinish={isFinishNode}
                                row={rowIndex}
                                col={colIndex}
                                dispatch={dispatch} />
                        })}
                    </RowWrapper>
                ))}
            </BoardWrapper>
        </BoardSection>
    );

    function splitNodePosition(currentKey: string) {
        let currentKeyData = currentKey.split('-');
        let row = parseInt(currentKeyData[0]);
        let col = parseInt(currentKeyData[1]);
        return { row, col };
    }

    function clearTimers() {
        //stop previous execution if there is one
        let highestTimeoutId = setTimeout(";");
        for (var i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }
    }
}

export default Board;