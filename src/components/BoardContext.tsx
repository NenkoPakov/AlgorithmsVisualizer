import React, { useContext, useRef } from 'react'
import { Algorithms } from '../services/common';

const defaultIteration = 0;
const BoardContext = React.createContext<any>('');
const BoardUpdateContext = React.createContext<any>('');

interface BoardsIteration {
    [name: string]: {
        currentIteration: number,
        iterationsCount?: number,
        isCompleted: boolean,
        finishTime?: string,
    }
}

interface State {
    isDrawingWallAction: boolean,
    isUnmarkWallAction: boolean,
    isInExecution: boolean,
    isPaused: boolean,
    boards: BoardsIteration,
}

export const ActionTypes = {
    ADD_BOARD: 'addBoard',
    REMOVE_BOARD: 'removeBoard',
    START_EXECUTION: 'startExecution',
    STOP_EXECUTION: 'stopExecution',
    START_DRAWING_WALL_ACTION: 'startDrawingWallAction',
    STOP_DRAWING_WALL_ACTION: 'stopDrawingWallAction',
    START_UNMARK_WALL_ACTION: 'startUnmarkWallAction',
    STOP_UNMARK_WALL_ACTION: 'stopUnmarkWallAction',
    JUMP_AT_INDEX: 'jumpAtIndex',
    STEP_FURTHER: 'stepFurther',
    STEP_BACK: 'stepBack',
    MARK_COMPLETED: 'markCompleted',
    SET_PAUSE: 'setPaused',
    REMOVE_PAUSE: 'removePaused',
    SET_ITERATIONS_COUNT: 'setIterationsCount',
    RESET: 'reset',
}

function reducer(state: State, action: any) {
    switch (action.type) {

        case ActionTypes.ADD_BOARD:
            const addAlgorithmKey = action.payload as keyof typeof Algorithms;
            state.boards[addAlgorithmKey] = { currentIteration: defaultIteration, isCompleted: false };
            return { ...state };

        case ActionTypes.REMOVE_BOARD:
            const removeAlgorithmKey = action.payload as keyof typeof Algorithms;
            delete state.boards[removeAlgorithmKey];
            return { ...state };

        case ActionTypes.START_DRAWING_WALL_ACTION:
            return { ...state, isDrawingWallAction: true };

        case ActionTypes.STOP_DRAWING_WALL_ACTION:
            return { ...state, isDrawingWallAction: false };

        case ActionTypes.START_UNMARK_WALL_ACTION:
            return { ...state, isUnmarkWallAction: true };

        case ActionTypes.STOP_UNMARK_WALL_ACTION:
            return { ...state, isUnmarkWallAction: false };

        case ActionTypes.START_EXECUTION:
            return { ...state, isInExecution: true };

        case ActionTypes.STOP_EXECUTION:
            return { ...state, isInExecution: false };

        case ActionTypes.JUMP_AT_INDEX:
            const { algorithmKey: jumpAlgorithmKey, targetIteration: jumpTargetIteration } = action.payload;
            state.boards[jumpAlgorithmKey].currentIteration = jumpTargetIteration;
            return { ...state };

        case ActionTypes.STEP_FURTHER:
            const stepFurtherAlgorithmKey = action.payload;

            if (!state.boards[stepFurtherAlgorithmKey].isCompleted) {
                ++state.boards[stepFurtherAlgorithmKey].currentIteration;
            }

            return { ...state };

        case ActionTypes.STEP_BACK:
            const stepBackAlgorithmKey = action.payload;

            if (!state.boards[stepBackAlgorithmKey].isCompleted) {
                --state.boards[stepBackAlgorithmKey].currentIteration;
            }

            if (state.boards[stepBackAlgorithmKey].isCompleted && state.boards[stepBackAlgorithmKey].currentIteration < state.boards[stepBackAlgorithmKey].iterationsCount!) {
                state.boards[stepBackAlgorithmKey].isCompleted = false;
            }

            return { ...state };

        case ActionTypes.MARK_COMPLETED:
            const completedAlgorithmKey = action.payload as keyof typeof Algorithms;
            state.boards[completedAlgorithmKey].isCompleted = true
            return { ...state };

        case ActionTypes.SET_PAUSE:
            return { ...state, isPaused: true };

        case ActionTypes.REMOVE_PAUSE:
            return { ...state, isPaused: false };

        case ActionTypes.SET_ITERATIONS_COUNT:
            const { iterationsAlgorithmKey, iterationsCount } = action.payload;
            state.boards[iterationsAlgorithmKey].iterationsCount = iterationsCount;
            return { ...state };

        case ActionTypes.RESET:
            Object.keys(state.boards).forEach(algorithmKey => {
                state.boards[algorithmKey].currentIteration = defaultIteration;
                state.boards[algorithmKey].isCompleted = false;
            });
            return { ...state, startTime: undefined, isPaused: false, isInExecution: false };

        default:
            return state;
    }
}

export const useBoardContext = () => {
    return useContext(BoardContext);
}

export const useBoardUpdateContext = () => {
    return useContext(BoardUpdateContext);
}

function BoardProvider({ children }: any) {
    const initState = {
        isDrawingWallAction: false,
        isUnmarkWallAction: false,
        isInExecution: false,
        isPaused: false,
        boards: {
            'BFS': {
                currentIteration: defaultIteration,
                isCompleted: false,
            }
        },
    };

    const [state, dispatch] = React.useReducer(reducer, initState);

    const cancellationToken = useRef<boolean>(false);
    const timer = useRef<string>('00:00:00');

    const handleCancellationToken = (value: boolean) => {
        cancellationToken.current = value;
        dispatch({ type: value ? ActionTypes.SET_PAUSE : ActionTypes.REMOVE_PAUSE })
    }

    return (
        <BoardContext.Provider value={{ ...state, cancellationToken,timer }}>
            <BoardUpdateContext.Provider value={{ dispatch, handleCancellationToken }}>
                {children}
            </BoardUpdateContext.Provider>
        </BoardContext.Provider>
    )
};

export default BoardProvider;
