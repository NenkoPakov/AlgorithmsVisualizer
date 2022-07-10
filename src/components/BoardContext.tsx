import React, { useCallback, useContext, useRef, useState } from 'react'

const BoardContext = React.createContext<any>({ isDrawingWall: false, isUnmarkAction: false });
const BoardUpdateContext = React.createContext<any>('');

export const useBoard = () => {
    return useContext(BoardContext);
}

export const useBoardUpdate = () => {
    return useContext(BoardUpdateContext);
}

function BoardProvider({ children }: any) {
    const [isDrawingWall, setIsDrawingWall] = useState<Boolean>(false);
    const [isUnmarkAction, setIsUnmarkAction] = useState<Boolean>(false);
    const [isInExecution, setIsInExecution] = useState<Boolean>(false);

    // const isInExecution = useRef<boolean>(false);

    const handleWallDrawingEvent = () => {
        setIsDrawingWall(isDrawingWall => !isDrawingWall);
    };

    const handleUnmarkEvent = (isUnmarkEvent: boolean) => {
        setIsUnmarkAction(() => isUnmarkEvent);
    };

    const handleExecution = () => {
        // isInExecution.current = !isInExecution.current;
        setIsInExecution(isInExecution => !isInExecution);
    };

    return (
        <BoardContext.Provider value={{ isDrawingWall, isUnmarkAction,isInExecution }}>
            <BoardUpdateContext.Provider value={{ handleWallDrawingEvent, handleUnmarkEvent, handleExecution }}>
                {children}
            </BoardUpdateContext.Provider>
        </BoardContext.Provider>
    )
};

export default BoardProvider;
