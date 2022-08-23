import React, { useContext, useRef } from 'react'

const BoardContext = React.createContext<any>('');
const BoardUpdateContext = React.createContext<any>('');

interface State {
    isDrawingWallAction: boolean,
    isUnmarkWallAction: boolean,
    isInExecution: boolean,
    iteration: number,
}

export const ActionTypes = {
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
            return { ...state, iteration: ++state.iteration };

        case ActionTypes.STEP_BACK:
            return { ...state, iteration: --state.iteration };

        case ActionTypes.RESET:
            return { ...state, isInExecution: false, iteration: -1 };

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
        iteration: -1,
    };

    const [state, dispatch] = React.useReducer(reducer, initState);

    const isExecutionCancelled = useRef<boolean>(false);

    const handleExecutionCancellation = (value: boolean) => {
        isExecutionCancelled.current = value;
    }

    return (
        <BoardContext.Provider value={{...state,isExecutionCancelled}}>
            <BoardUpdateContext.Provider value={{ dispatch, handleExecutionCancellation }}>
                {children}
            </BoardUpdateContext.Provider>
        </BoardContext.Provider>
    )
};

export default BoardProvider;
