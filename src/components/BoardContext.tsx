import React, { useContext, useRef } from 'react'
import { Algorithm } from '../global';
import { BoardContextProvider, BoardUpdateContextProvider, State } from '../interfaces/Context.interface';

const DEFAULT_ITERATION = 0;
const INITIAL_TIMER_VALUE = '00:00:00';
const BOARD_INITIAL_CONTEXT: BoardContextProvider = {
    cancellationToken: {current:false},
    duration: {current:''},
    isDrawingWallAction: false,
    isUnmarkWallAction: false,
    isInExecution: false,
    isPaused: false,
    boards: {},
}

const BOARD_UPDATE_INITIAL_CONTEXT: BoardUpdateContextProvider = {
    dispatch: Function,
    handleCancellationToken: Function,
}

const BoardContext = React.createContext<BoardContextProvider>(BOARD_INITIAL_CONTEXT);
const BoardUpdateContext = React.createContext<BoardUpdateContextProvider>(BOARD_UPDATE_INITIAL_CONTEXT);

let minutes = 0;
let seconds = 0;
let milliseconds = 0;
let interval: NodeJS.Timer;
let timer: string;

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
    STEP_FORWARD: 'stepForward',
    STEP_BACK: 'stepBack',
    MARK_COMPLETED: 'markCompleted',
    SET_PAUSE: 'setPaused',
    REMOVE_PAUSE: 'removePaused',
    SET_ITERATIONS_COUNT: 'setIterationsCount',
    SET_PATH_RESULT: 'setPathResult',
    RESET: 'reset',
}

function reducer(state: State, action: any) {
    switch (action.type) {

        case ActionTypes.ADD_BOARD:
            const addAlgorithmKey = action.payload as keyof typeof Algorithm;
            state.boards[addAlgorithmKey] = { currentIteration: DEFAULT_ITERATION, isCompleted: false };
            return { ...state };

        case ActionTypes.REMOVE_BOARD:
            const removeAlgorithmKey = action.payload as keyof typeof Algorithm;
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
            startTimer();
            return { ...state, isInExecution: true };

        case ActionTypes.STOP_EXECUTION:
            stopTimer();
            return { ...state, isInExecution: false };

        case ActionTypes.JUMP_AT_INDEX:
            const { algorithmKey: jumpAlgorithmKey, targetIteration: jumpTargetIteration } = action.payload;
            state.boards[jumpAlgorithmKey].currentIteration = jumpTargetIteration;
            return { ...state };

        case ActionTypes.STEP_FORWARD:
            const stepForwardAlgorithmKey = action.payload;

            if (!state.boards[stepForwardAlgorithmKey].isCompleted) {
                ++state.boards[stepForwardAlgorithmKey].currentIteration;
            }

            return { ...state };

        case ActionTypes.STEP_BACK:
            const stepBackAlgorithmKey = action.payload;
            if (state.boards[stepBackAlgorithmKey].currentIteration == 0) {
                return { ...state };
            }

            if (!state.boards[stepBackAlgorithmKey].isCompleted) {
                --state.boards[stepBackAlgorithmKey].currentIteration;
            }

            if (state.boards[stepBackAlgorithmKey].isCompleted && state.boards[stepBackAlgorithmKey].currentIteration < state.boards[stepBackAlgorithmKey].iterationsCount!) {
                state.boards[stepBackAlgorithmKey].isCompleted = false;
            }

            return { ...state };

        case ActionTypes.MARK_COMPLETED:
            const completedAlgorithmKey = action.payload as keyof typeof Algorithm;
            state.boards[completedAlgorithmKey].isCompleted = true;
            state.boards[completedAlgorithmKey].duration = timer;
            return { ...state };

        case ActionTypes.SET_PAUSE:
            stopTimer();
            return { ...state, isPaused: true };

        case ActionTypes.REMOVE_PAUSE:
            startTimer();
            return { ...state, isPaused: false };

        case ActionTypes.SET_ITERATIONS_COUNT:
            const { iterationsAlgorithmKey, iterationsCount } = action.payload;
            state.boards[iterationsAlgorithmKey].iterationsCount = iterationsCount;
            return { ...state };

        case ActionTypes.SET_PATH_RESULT:
            return { ...state, isFoundPath: action.payload };

        case ActionTypes.RESET:
            Object.keys(state.boards).forEach(algorithmKey => {
                state.boards[algorithmKey] = {
                    currentIteration: DEFAULT_ITERATION,
                    isCompleted: false,
                    iterationsCount: state.boards[algorithmKey].iterationsCount,
                }
            });

            delete state.isFoundPath;
            resetTimer();

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

const timerFunc = () => {
    milliseconds++;

    if (milliseconds > 99) {
        seconds++;
        milliseconds = 0;
    }

    if (seconds > 59) {
        minutes++;
        seconds = 0;
    }

    timer = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}:${milliseconds < 10 ? `0${milliseconds}` : milliseconds}`;
}

const startTimer = () => {
    clearInterval(interval);
    interval = setInterval(timerFunc, 10);
}

const stopTimer = () => {
    clearInterval(interval);
}

const resetTimer = () => {
    clearInterval(interval);
    minutes = 0;
    seconds = 0;
    milliseconds = 0;
}

function BoardProvider({ children }: any) {
    const initState = {
        isDrawingWallAction: false,
        isUnmarkWallAction: false,
        isInExecution: false,
        isPaused: false,
        boards: {
            'BFS': {
                currentIteration: DEFAULT_ITERATION,
                isCompleted: false,
            }
        },
    };

    const [state, dispatch] = React.useReducer(reducer, initState);

    const cancellationToken = useRef<boolean>(false);
    const duration = useRef<string>(INITIAL_TIMER_VALUE);

    duration.current = timer;

    const handleCancellationToken = (value: boolean) => {
        cancellationToken.current = value;
        dispatch({ type: value ? ActionTypes.SET_PAUSE : ActionTypes.REMOVE_PAUSE })
    }

    return (
        <BoardContext.Provider value={{ ...state, cancellationToken, duration }}>
            <BoardUpdateContext.Provider value={{ dispatch, handleCancellationToken }}>
                {children}
            </BoardUpdateContext.Provider>
        </BoardContext.Provider>
    )
};

export default BoardProvider;
