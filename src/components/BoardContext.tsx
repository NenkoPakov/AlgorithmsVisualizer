import React, { useContext, useRef, useState } from 'react'

const BoardContext = React.createContext<any>('');
const BoardUpdateContext = React.createContext<any>('');

export const useBoardContext = () => {
    return useContext(BoardContext);
}

export const useBoardUpdateContext = () => {
    return useContext(BoardUpdateContext);
}

function BoardProvider({ children }: any) {
    const [isDrawingWall, setIsDrawingWall] = useState<Boolean>(false);
    const [isUnmarkAction, setIsUnmarkAction] = useState<Boolean>(false);
    const [isInExecution, setIsInExecution] = useState<Boolean>(false);
    // const [isCancelled, setIsCancelled] = useState<Boolean>(false);

    const isCancelled = useRef<boolean>(false);
    // const isInExecution = useRef<boolean>(false);

    const handleWallDrawingEvent = () => {
        setIsDrawingWall(isDrawingWall => !isDrawingWall);
    };

    const handleUnmarkEvent = (isUnmarkEvent: boolean) => {
        setIsUnmarkAction(() => isUnmarkEvent);
    };

    const handleExecution = (value: boolean) => {
        setIsInExecution(value);
        // isInExecution.current=value;
    };


    const handleCancellation = (value: boolean) => {
        // setIsCancelled(value);
        isCancelled.current=value;
    }

    return (
        <BoardContext.Provider value={{ isDrawingWall, isUnmarkAction, isInExecution, isCancelled }}>
            <BoardUpdateContext.Provider value={{ handleWallDrawingEvent, handleUnmarkEvent, handleExecution, handleCancellation }}>
                {children}
            </BoardUpdateContext.Provider>
        </BoardContext.Provider>
    )
};

export default BoardProvider;
