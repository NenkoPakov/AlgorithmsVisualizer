import Cell from './Cell';
import React, { ReducerAction, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { AlgorithmData, AlgorithmResult, BoardProps, State } from '../interfaces/Board.interface';
import { CellProps, Node } from '../interfaces/Cell.interface';
import { useBoardContext, useBoardUpdateContext, ActionTypes as ContextActionTypes } from './BoardContext';
import { getMatrixInitValue, parseNodeData, matrixDeepCopy, BackgroundColorType } from '../global'
import { Algorithm } from '../global';
import { Action } from '../interfaces/Reducer.interface';

const INITIAL_INDEX = 0;

const BoardSection = styled.section`
    position:relative;
    display: flex;
    flex-direction:column;
    height:100%;
    min-height:500px;
    background-color:${BackgroundColorType.White};
    padding:5px 20px 20px 20px;
    border-radius:20px;
`;

const BoardInfo = styled.div`
    position:relative;
    display: flex;
    flex-direction:row;
    margin-bottom:5px;
`;

const AlgorithmName = styled.h2`
    justify-content:flex-start;
    margin:0;
`;

const Duration = styled.h3`
    position:absolute;
    left:50%;
    margin:0;
`;

const Rank = styled.h2`
    position:absolute;
    right:0;
    margin:0;
`;

const BoardWrapper = styled.div`
    position:relative;
    display: flex;
    flex-basis:100%;
    flex-direction:column;
    /* border:solid 5px gray; */
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

function reducer(state: State, action: Action) {
    switch (action.type) {
        case ActionTypes.RESET:
            return { ...state, visitedNodes: matrixDeepCopy(action.payload) as boolean[][], frontierNodes: matrixDeepCopy(action.payload) as boolean[][], pathNodes: matrixDeepCopy(action.payload) as boolean[][] };

        case ActionTypes.UPDATE_SIZE:
            let { booleanMatrix, numericMatrix } = action.payload;
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

const Board = ({ boardRows, boardCols, wallNodes, startNode, finishNode, algorithmKey, boardManagerDispatch: boardManagerDispatch, delayFunc }: BoardProps) => {

    const initState = {
        visitedNodes: getMatrixInitValue(boardRows, boardCols) as boolean[][],
        frontierNodes: getMatrixInitValue(boardRows, boardCols) as boolean[][],
        pathNodes: getMatrixInitValue(boardRows, boardCols) as boolean[][],
        nodeValues: getMatrixInitValue(boardRows, boardCols, true) as number[][],
        foundPath: [],
        algorithmResult: [],
    }

    const [state, dispatch] = React.useReducer(reducer, initState);
    const lastUsedIterationIndex = useRef<number>(INITIAL_INDEX);

    const boardContext = useBoardContext();
    const boardUpdateContext = useBoardUpdateContext();

    useEffect(() => {
        //when start button is pressed
        if (boardContext.isInExecution) {
            getAlgorithmResultAsync();
        } else {
            //when reset button is pressed
            reset();
        }
    }, [boardContext.isInExecution])

    // when getAlgorithmResultAsync() finish and state.algorithmResult has been set
    useEffect(() => {
        if (state.algorithmResult && state.algorithmResult.length > 0) {
            startAnimationAsync();
        }
    }, [state.algorithmResult])

    useEffect(() => {
        if (boardContext.isInExecution && !boardContext.isPaused) {
            startAnimationAsync();
        }
    }, [boardContext.isPaused])

    //update cells on a single step forward or back
    useEffect(() => {
        if (!boardContext.isInExecution) {
            return;
        }

        const targetIteration = boardContext.boards[algorithmKey].currentIteration;
        updateCells(targetIteration);
    }, [boardContext.boards[algorithmKey].currentIteration])

    // when visualization is done. Checking for path between start and finish 
    useEffect(() => {
        if (boardContext.boards[algorithmKey].isCompleted && boardContext.isFoundPath) {
            startPathAnimationAsync();
        }
    }, [boardContext.boards[algorithmKey].isCompleted])

    //when boards size is changed
    useEffect(() => {
        dispatch({ type: ActionTypes.UPDATE_SIZE, payload: { booleanMatrix: getMatrixInitValue(boardRows, boardCols), numericMatrix: getMatrixInitValue(boardRows, boardCols, true) } });
    }, [boardRows, boardCols])

    const getAlgorithmResultAsync = async (): Promise<void> => {
        const algorithmFunc = Algorithm[algorithmKey];
        let { result, isFoundPath }: { result: AlgorithmResult[], isFoundPath: boolean } = await algorithmFunc(wallNodes, startNode, finishNode);

        dispatch({ type: ActionTypes.SET_ALGORITHM_RESULT, payload: result });
        boardUpdateContext.dispatch({ type: ContextActionTypes.SET_ITERATIONS_COUNT, payload: { iterationsAlgorithmKey: algorithmKey, iterationsCount: result.length } })

        if (boardContext.isFoundPath == undefined) {
            boardUpdateContext.dispatch({ type: ContextActionTypes.SET_PATH_RESULT, payload: isFoundPath })
        }
    };

    const reset = (): void => {
        dispatch({ type: ActionTypes.RESET, payload: getMatrixInitValue(boardRows, boardCols) });
        lastUsedIterationIndex.current = INITIAL_INDEX;
    };

    const startPathAnimationAsync = (): void => {
        //last element of state.algorithmResult must be the target node
        let currentNode = state.algorithmResult[state.algorithmResult.length - 1];
        let currentNodeValues: AlgorithmData[] = Object.values(currentNode);
        let parentNode = currentNodeValues[0].parent;

        while (parentNode) {
            dispatch({ type: ActionTypes.SET_PATH_NODE, payload: parseNodeData(parentNode) });

            let parentNodeIndex = state.algorithmResult.findIndex((iteration: AlgorithmResult) => {
                return Object.keys(iteration).includes(parentNode!)
            });

            currentNode = state.algorithmResult[parentNodeIndex];
            currentNodeValues = Object.values(currentNode);
            parentNode = currentNodeValues[0].parent;
        }
    }

    const startAnimationAsync = async (): Promise<void> => {
        boardUpdateContext.handleCancellationToken(false);

        while (!boardContext.cancellationToken.current) {
            if (!boardContext.boards[algorithmKey].isCompleted) {
                if (lastUsedIterationIndex.current == state.algorithmResult.length - 1) {
                    break;
                }

                boardUpdateContext.dispatch({ type: ContextActionTypes.STEP_FORWARD, payload: algorithmKey });
            }

            await delayFunc();
        }

    }

    const updateCells = (targetIteration: number): void => {
        const isStepForward = targetIteration >= lastUsedIterationIndex.current

        while (lastUsedIterationIndex.current != targetIteration) {
            isStepForward
                ? stepForward()
                : stepBack();
        }

    }

    const stepForward = (): void => {
        lastUsedIterationIndex.current += 1;
        let useIndex = lastUsedIterationIndex.current;

        state.algorithmResult[useIndex] && Object.keys(state.algorithmResult[useIndex]).forEach(currentKey => {
            const currentNode = state.algorithmResult[useIndex][currentKey];
            let frontier: Node = parseNodeData(currentKey);
            let parent: Node | undefined = currentNode.parent ? parseNodeData(currentNode.parent!) : undefined;
            let value: number = currentNode.value;
            if (parent) {
                dispatch({ type: ActionTypes.SET_VISITED_NODE, payload: parent });
            }

            dispatch({ type: ActionTypes.SET_NODE_VALUE, payload: { frontier, value } });
            dispatch({ type: ActionTypes.SET_FRONTIER_NODE, payload: frontier });
        });

        if (useIndex == state.algorithmResult.length - 1) {
            boardUpdateContext.dispatch({ type: ContextActionTypes.MARK_COMPLETED, payload: algorithmKey });
            return;
        }

        //state.algorithmResult[0] is for the start node which we want to skip
    }

    const stepBack = (): void => {
        let useIndex = lastUsedIterationIndex.current;

        state.algorithmResult[useIndex] && Object.keys(state.algorithmResult[useIndex]).forEach(currentKey => {
            const currentNode = state.algorithmResult[useIndex][currentKey];
            let frontier: Node = parseNodeData(currentKey);
            let parent: Node | undefined = currentNode.parent ? parseNodeData(currentNode.parent!) : undefined;

            dispatch({ type: ActionTypes.SET_FREE_NODE, payload: frontier });

            if (parent) {
                dispatch({ type: ActionTypes.REMOVE_VISITED_NODE, payload: parent });
            }
        });

        lastUsedIterationIndex.current -= 1;
    }

    const boardRenderFunc = (): CellProps[][] => {
        const board: CellProps[][] = [];

        //boardRows and wallNodes are passed by the BoardManager component. Because the useEffect is executed after the rendering we have to work with the smaller matrix to prevent exceptions during rendering
        //I chose to use state.pathNodes but here could be used any of the matrixes in the Board state
        const lessRows = Math.min(boardRows, state.pathNodes.length);
        const lessCols = Math.min(boardCols, state.pathNodes[0].length);
        for (let rowIndex = 0; rowIndex < lessRows; rowIndex++) {
            board[rowIndex] = [];
            for (let colIndex = 0; colIndex < lessCols; colIndex++) {
                let isStartNode = rowIndex === startNode.row && colIndex === startNode.col;
                let isFinishNode = rowIndex === finishNode.row && colIndex === finishNode.col;

                board[rowIndex][colIndex] = {
                    value: state.nodeValues[rowIndex][colIndex],
                    isVisited: state.visitedNodes[rowIndex][colIndex],
                    isFrontier: state.frontierNodes[rowIndex][colIndex],
                    isWall: wallNodes[rowIndex][colIndex],
                    isPartOfThePath: state.pathNodes[rowIndex][colIndex],
                    isStart: isStartNode,
                    isFinish: isFinishNode,
                    row: rowIndex,
                    col: colIndex,
                    boardManagerDispatch: boardManagerDispatch,
                }
            }
        }

        return board;
    }

    return (
        <BoardSection>
            <BoardInfo>
                <AlgorithmName>{algorithmKey}</AlgorithmName>
                {boardContext.boards[algorithmKey].duration &&
                    <Duration>
                        {boardContext.boards[algorithmKey].duration}
                    </Duration>}
                {boardContext.boards[algorithmKey].isCompleted && Object.keys(boardContext.boards).length > 1 &&
                    <Rank>
                        #{
                            Object.keys(boardContext.boards).sort((key1, key2) => boardContext.boards[key1].iterationsCount! - boardContext.boards[key2].iterationsCount!).indexOf(algorithmKey) + 1
                        }
                    </Rank>}
            </BoardInfo>
            <BoardWrapper>
                {boardRenderFunc().map(row => (
                    <RowWrapper>
                        {row.map(cell => {
                            return <Cell
                                key={`board-cell-${cell.row}-${cell.col}`}
                                {...cell} />
                        })}
                    </RowWrapper>
                ))}
            </BoardWrapper>
        </BoardSection>
    );
}

export default Board;