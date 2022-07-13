import Cell from './Cell';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { ComeFrom, ComeFromData, BoardProps } from '../interfaces/Board.interface';
import { Node } from '../interfaces/Cell.interface';
import { useBoardContext, useBoardUpdateContext } from './BoardContext';
import { getMatrixInitValue, splitNodePosition, matrixDeepCopy } from '../global'

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
border:solid 5px gray;
border-radius:10px;
gap:1px;
overflow:hidden;
`;

const RowWrapper = styled.div`
width:100%;
position:relative;
display: flex;
flex-basis:100%;
flex-direction:row;
gap:1px;
`;

interface State {
    visitedNodes: boolean[][],
    frontierNodes: boolean[][],
    pathNodes: boolean[][],
    nodeValues: number[][],
    foundPath: Node[],
}

export const ActionTypes = {
    UPDATE_SIZE: 'updateSize',
    CLEAR_MATRIX: 'clearMatrix',
    CLEAR_SOLUTION: 'clearSolution',
    SET_VISITED_NODE: 'setVisitedNode',
    SET_FRONTIER_NODE: 'setFrontierNode',
    SET_PATH_NODE: 'setPathNode',
    SET_NODE_VALUE: 'setNodeValue',
}

function reducer(state: State, action: any) {
    switch (action.type) {
        case ActionTypes.CLEAR_MATRIX:
            // return { ...state, visitedNodes: matrixDeepCopy(action.payload) as boolean[][], frontierNodes: matrixDeepCopy(action.payload) as boolean[][], pathNodes: matrixDeepCopy(action.payload) as boolean[][], wallNodes: matrixDeepCopy(action.payload) as boolean[][] };
            return { ...state, visitedNodes: matrixDeepCopy(action.payload) as boolean[][], frontierNodes: matrixDeepCopy(action.payload) as boolean[][], pathNodes: matrixDeepCopy(action.payload) as boolean[][] };

        case ActionTypes.UPDATE_SIZE:
            let { booleanMatrix, numericMatrix } = action.payload;
            // return { ...state, visitedNodes: matrixDeepCopy(booleanMatrix) as boolean[][], frontierNodes: matrixDeepCopy(booleanMatrix) as boolean[][], pathNodes: matrixDeepCopy(booleanMatrix) as boolean[][], wallNodes: matrixDeepCopy(booleanMatrix) as boolean[][], nodeValues: matrixDeepCopy(numericMatrix) as number[][] };
            return { ...state, visitedNodes: matrixDeepCopy(booleanMatrix) as boolean[][], frontierNodes: matrixDeepCopy(booleanMatrix) as boolean[][], pathNodes: matrixDeepCopy(booleanMatrix) as boolean[][], nodeValues: matrixDeepCopy(numericMatrix) as number[][] };

        case ActionTypes.CLEAR_SOLUTION:
            return { ...state, visitedNodes: matrixDeepCopy(action.payload) as boolean[][], pathNodes: matrixDeepCopy(action.payload) as boolean[][] };

        case ActionTypes.SET_VISITED_NODE:
            let { row: visitedRow, col: visitedCol }: Node = action.payload;
            state.visitedNodes[visitedRow][visitedCol] = true;

            return { ...state, visitedNodes: state.visitedNodes as boolean[][] };

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

        default:
            return state;
    }
}

function Board({ boardRows, boardCols, wallNodes, startNode, finishNode, recentlyVisitedNodes, delayFunc, algorithmFunc, parentDispatch }: BoardProps) {

    const initState = {
        visitedNodes: getMatrixInitValue(boardRows, boardCols) as boolean[][],
        frontierNodes: getMatrixInitValue(boardRows, boardCols) as boolean[][],
        pathNodes: getMatrixInitValue(boardRows, boardCols) as boolean[][],
        nodeValues: getMatrixInitValue(boardRows, boardCols, true) as number[][],
        foundPath: [],
        // startNode: { row: 0, col: 0 },
        // finishNode: { row: boardRows - 1, col: boardCols - 1 },
        // wallNodes: getMatrixInitValue(boardRows, boardCols) as boolean[][],
        // wallSelectionStartNode: { row: -1, col: -1 },
        // proposedWall: [],
        // draggedNodePosition: { row: -1, col: -1 },
    }

    const [state, dispatch] = React.useReducer(reducer, initState);
    // const isCancelled = useRef<Boolean>(false);

    const generatorAlgorithmFunc = useMemo(() => algorithmFunc(wallNodes, startNode, finishNode), [wallNodes, startNode, finishNode]);

    const { isDrawingWall, isUnmarkAction, isInExecution, isCancelled } = useBoardContext();
    const { handleWallDrawingEvent, handleUnmarkEvent, handleExecution, handleCancellation } = useBoardUpdateContext();

    useEffect(() => {
        if (isInExecution) {
            test();
        }
    }, [isInExecution, isCancelled])

    const test = async () => {
        let lastComeFrom = generatorAlgorithmFunc.next();
        while (!lastComeFrom.done && !isCancelled) {
            const recentlyVisitedNodes: { frontier: Node, parent: Node | undefined, value: number }[] = Object.keys(lastComeFrom.value).map(currentKey => {
                let frontier = splitNodePosition(currentKey);
                let parent = lastComeFrom.value[currentKey].parent ? splitNodePosition(lastComeFrom.value[currentKey].parent!) : undefined;
                let value: number = lastComeFrom.value[currentKey].value;

                return { frontier, parent, value };
            });

            for (const node of recentlyVisitedNodes) {
                dispatch({ type: ActionTypes.SET_FRONTIER_NODE, payload: node.frontier });
                dispatch({ type: ActionTypes.SET_VISITED_NODE, payload: node.parent });
                dispatch({ type: ActionTypes.SET_NODE_VALUE, payload: node });
            }

            await delayFunc();

            lastComeFrom = generatorAlgorithmFunc.next();
        }

    };

    useEffect(() => {
        dispatch({ type: ActionTypes.UPDATE_SIZE, payload: { booleanMatrix: getMatrixInitValue(boardRows, boardCols), numericMatrix: getMatrixInitValue(boardRows, boardCols, true) } });
    }, [boardRows, boardCols])

    const executeAlgorithm = async () => {
        for (const lastComeFrom of generatorAlgorithmFunc) {
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

            if (isCancelled) {
                break;
            }

            await delayFunc();
        }
    };

    const clearMatrix = () => {
        // clearTimers();
        handleExecution(false);
        dispatch({ type: ActionTypes.CLEAR_MATRIX, payload: getMatrixInitValue(boardRows, boardCols) });
    };

    return (
        <BoardSection>
            {/* <ButtonWrapper>
                <button key='execute' onClick={() => executeAlgorithm()}>Execute</button>
                <button key='clear' onClick={() => clearMatrix()}>Clear board</button>
                <button key='pause' onClick={() => isCancelled.current = true}>Pause</button>
                <button key='continue' onClick={() => { isCancelled.current = false, executeAlgorithm() }}>Continue</button>
            </ButtonWrapper> */}
            <BoardWrapper>
                {/* visitedNodes is used just for the iteration through all rows and cols */}
                {state.visitedNodes.map((row: boolean[], rowIndex: number) => (
                    <RowWrapper>
                        {row.map((_, colIndex) => {
                            let isStartNode = rowIndex === startNode.row && colIndex === startNode.col;
                            let isFinishNode = rowIndex === finishNode.row && colIndex === finishNode.col;

                            return <Cell
                                key={`board-cell-${rowIndex}-${colIndex}`}
                                value={state.nodeValues[rowIndex][colIndex]}
                                isVisited={state.visitedNodes[rowIndex][colIndex]}
                                isFrontier={state.frontierNodes[rowIndex][colIndex]}
                                isWall={wallNodes[rowIndex][colIndex]}
                                isPartOfThePath={state.pathNodes[rowIndex][colIndex]}
                                isStart={isStartNode}
                                isFinish={isFinishNode}
                                row={rowIndex}
                                col={colIndex}
                                dispatch={parentDispatch} />
                        })}
                    </RowWrapper>
                ))}
            </BoardWrapper>
        </BoardSection>
    );
}

function clearTimers() {
    //stop previous execution if there is one
    let highestTimeoutId = setTimeout(";");
    for (var i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
    }
}

export default Board;