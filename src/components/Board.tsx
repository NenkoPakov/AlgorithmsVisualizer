import Cell from './Cell';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { ComeFrom, ComeFromData, BoardProps } from '../interfaces/Board.interface';
import { Node } from '../interfaces/Cell.interface';
import { useBoardContext, useBoardUpdateContext } from './BoardContext';
import { getMatrixInitValue, splitNodePosition, matrixDeepCopy } from '../global'
import { IndexInfo, IndexKind } from 'typescript';
import { Algorithms } from '../services/common';

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
    algorithmResult: [],
}

export const ActionTypes = {
    UPDATE_SIZE: 'updateSize',
    RESET: 'reset',
    CLEAR_SOLUTION: 'clearSolution',
    SET_VISITED_NODE: 'setVisitedNode',
    SET_VISITED_NODES: 'setVisitedNodes',
    SET_FREE_NODE: 'setFreeNode',
    REMOVE_VISITED_NODE: 'removeVisitedNode',
    SET_FRONTIER_NODE: 'setFrontierNode',
    SET_FRONTIER_NODES: 'setFrontiersNode',
    SET_PATH_NODE: 'setPathNode',
    SET_NODE_VALUE: 'setNodeValue',
    SET_NODES_VALUE: 'setNodesValue',
    REMOVE_NODE_VALUE: 'removeNodeValue',
    SET_ALGORITHM_RESULT: 'setAlgorithmResult',
}

function reducer(state: State, action: any) {
    switch (action.type) {
        case ActionTypes.RESET:
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

        case ActionTypes.SET_VISITED_NODES:
            let visitedNodes: Node[] = action.payload;

            visitedNodes.forEach(({ row: visitedRow, col: visitedCol }) => {

                state.visitedNodes[visitedRow][visitedCol] = true;
            })

            return { ...state, visitedNodes: state.visitedNodes as boolean[][] };

        case ActionTypes.SET_FREE_NODE:
            let { row: freeNodeRow, col: freeNodeCol }: Node = action.payload;
            state.frontierNodes[freeNodeRow][freeNodeCol] = false;
            state.nodeValues[freeNodeRow][freeNodeCol] = 0;

            return { ...state, frontierNodes: state.frontierNodes as boolean[][], nodeValues: state.nodeValues as number[][] };

        case ActionTypes.REMOVE_VISITED_NODE:
            let { row: removeNodeRow, col: removeNodeCol }: Node = action.payload;
            state.visitedNodes[removeNodeRow][removeNodeCol] = false;

            return { ...state, visitedNodes: state.visitedNodes as boolean[][] };

        case ActionTypes.SET_FRONTIER_NODE:
            let { row: frontierRow, col: frontierCol }: Node = action.payload;
            state.frontierNodes[frontierRow][frontierCol] = true;

            return { ...state, frontierNodes: state.frontierNodes };

        case ActionTypes.SET_FRONTIER_NODES:
            let frontierNodes: Node[] = action.payload;

            frontierNodes.forEach(({ row: frontierRow, col: frontierCol }) => {
                state.frontierNodes[frontierRow][frontierCol] = true;
            })

            return { ...state, frontierNodes: state.frontierNodes };

        case ActionTypes.SET_PATH_NODE:
            let { row: pathRow, col: pathCol }: Node = action.payload;

            state.pathNodes[pathRow][pathCol] = !state.pathNodes[pathRow][pathCol];

            return { ...state, pathNodes: state.pathNodes };

        case ActionTypes.SET_NODE_VALUE:
            let { row: nodeValueRow, col: nodeValueCol }: Node = action.payload.frontier;

            state.nodeValues[nodeValueRow][nodeValueCol] = action.payload.value;

            return { ...state, nodeValues: state.nodeValues };

        case ActionTypes.SET_NODES_VALUE:
            let nodeValues: { frontier: Node, value: number }[] = action.payload;

            nodeValues.forEach(({ frontier, value }) => {
                let { row: nodeValueRow, col: nodeValueCol } = frontier;

                state.nodeValues[nodeValueRow][nodeValueCol] = value;
            })

            return { ...state, nodeValues: state.nodeValues };

        case ActionTypes.REMOVE_NODE_VALUE:
            let { row: removeNodeValueRow, col: removeNodeValueCol }: Node = action.payload;

            state.nodeValues[removeNodeValueRow][removeNodeValueCol] = 0;

            return { ...state, nodeValues: state.nodeValues };

        case ActionTypes.SET_ALGORITHM_RESULT:
            return { ...state, algorithmResult: action.payload };

        default:
            return state;
    }
}

const Board = ({ boardRows, boardCols, wallNodes, startNode, finishNode, recentlyVisitedNodes, delayFunc, algorithmKey, parentDispatch }: BoardProps) => {

    const initState = {
        visitedNodes: getMatrixInitValue(boardRows, boardCols) as boolean[][],
        frontierNodes: getMatrixInitValue(boardRows, boardCols) as boolean[][],
        pathNodes: getMatrixInitValue(boardRows, boardCols) as boolean[][],
        nodeValues: getMatrixInitValue(boardRows, boardCols, true) as number[][],
        foundPath: [],
        algorithmResult: [],
    }

    const [state, dispatch] = React.useReducer(reducer, initState);
    const previousIteration = useRef<number>(0);

    const boardContext = useBoardContext();
    const boardUpdateContext = useBoardUpdateContext();

    useEffect(() => {
        executeAlgorithm();
    }, [])

    useEffect(() => {
        const currentIteration = boardContext.boards[algorithmKey];

        if (currentIteration === -1) {
            reset();
        }

        if (currentIteration > state.algorithmResult.length) {
            return;
        }

        let isStepFurther = previousIteration.current < currentIteration;
        let useIndex = isStepFurther ? currentIteration : previousIteration.current;

        let iterationsCount = state.algorithmResult.length;

        if (currentIteration >= 0 && currentIteration < iterationsCount) {

            Object.keys(state.algorithmResult[useIndex]).forEach(currentKey => {
                const currentNode = state.algorithmResult[useIndex][currentKey];
                let frontier: Node = splitNodePosition(currentKey);
                let parent: Node | undefined = currentNode.parent ? splitNodePosition(currentNode.parent!) : undefined;
                let value: number = currentNode.value;

                switch (isStepFurther) {
                    case true:
                        if (parent) {
                            dispatch({ type: ActionTypes.SET_VISITED_NODE, payload: parent });
                        }

                        dispatch({ type: ActionTypes.SET_NODE_VALUE, payload: { frontier, value } });
                        dispatch({ type: ActionTypes.SET_FRONTIER_NODE, payload: frontier });
                        break;

                    case false:
                        dispatch({ type: ActionTypes.SET_FREE_NODE, payload: frontier });

                        if (parent) {
                            dispatch({ type: ActionTypes.REMOVE_VISITED_NODE, payload: parent });
                        }

                        break;

                    default:
                        break;
                }

            });
        }

        previousIteration.current = currentIteration;
    }, [boardContext.boards[algorithmKey]])

    useEffect(() => {
        dispatch({ type: ActionTypes.UPDATE_SIZE, payload: { booleanMatrix: getMatrixInitValue(boardRows, boardCols), numericMatrix: getMatrixInitValue(boardRows, boardCols, true) } });
    }, [boardRows, boardCols])

    const executeAlgorithm = async () => {
        const algorithmFunc = Algorithms[algorithmKey];
        var cameFrom = await algorithmFunc(wallNodes, startNode, finishNode);
        dispatch({ type: ActionTypes.SET_ALGORITHM_RESULT, payload: cameFrom });
    };

    const reset = () => {
        dispatch({ type: ActionTypes.RESET, payload: getMatrixInitValue(boardRows, boardCols) });
    };

    return (
        <BoardSection>
            {/* <ButtonWrapper>
                <button key='execute' onClick={() => executeAlgorithm()}>Execute</button>
                <button key='clear' onClick={() => reset()}>Clear board</button>
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