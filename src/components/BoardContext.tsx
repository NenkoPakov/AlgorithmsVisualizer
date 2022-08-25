import React, { useContext, useRef } from 'react'
import { Algorithms } from '../services/common';

const BoardContext = React.createContext<any>('');
const BoardUpdateContext = React.createContext<any>('');

interface BoardsIteration {
    [name: string]: number
}

interface State {
    isDrawingWallAction: boolean,
    isUnmarkWallAction: boolean,
    isInExecution: boolean,
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
    STEP_FURTHER: 'stepFurther',
    STEP_BACK: 'stepBack',
    RESET: 'reset',
}

function reducer(state: State, action: any) {
    switch (action.type) {

        case ActionTypes.ADD_BOARD:
            const addBoardKey = action.payload as keyof typeof Algorithms;
            state.boards[addBoardKey] = 0;
            return { ...state };

        case ActionTypes.REMOVE_BOARD:
            const removeBoardKey = action.payload as keyof typeof Algorithms;
            delete state.boards[removeBoardKey];
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

        case ActionTypes.STEP_FURTHER:
            const stepFurtherBoardKey = action.payload as keyof typeof Algorithms;
            return { ...state, iteration: ++state.boards[stepFurtherBoardKey] };

        case ActionTypes.STEP_BACK:
            const stepBackBoardKey = action.payload as keyof typeof Algorithms;
            return { ...state, iteration: --state.boards[stepBackBoardKey] };

        case ActionTypes.RESET:
            Object.keys(state.boards).map(key => state.boards[key] = 0);
            return { ...state, isInExecution: false };

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
        boards: {
            'BFS': 0,
            // 'Greedy Best FS': -1,
        },
    };

    const [state, dispatch] = React.useReducer(reducer, initState);

    const cancellationToken = useRef<boolean>(false);

    const handleCancellationToken = (value: boolean) => {
        cancellationToken.current = value;
    }

    return (
        <BoardContext.Provider value={{ ...state, cancellationToken }}>
            <BoardUpdateContext.Provider value={{ dispatch, handleCancellationToken }}>
                {children}
            </BoardUpdateContext.Provider>
        </BoardContext.Provider>
    )
};

export default BoardProvider;
