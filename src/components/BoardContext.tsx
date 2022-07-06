import React, { useContext, useState } from 'react'

const BoardContext = React.createContext<any>({isDrawingWall:false, isUnmarkAction:false});
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

    const handleWallDrawingEvent = () => {
        setIsDrawingWall(isDrawingWall => !isDrawingWall);
    }

    const handleUnmarkEvent = (isUnmarkEvent:boolean) => {
        setIsUnmarkAction(() => isUnmarkEvent);
    }

    return (
        <BoardContext.Provider value={{isDrawingWall, isUnmarkAction}}>
            <BoardUpdateContext.Provider value={{handleWallDrawingEvent,handleUnmarkEvent}}>
                {children}
            </BoardUpdateContext.Provider>
        </BoardContext.Provider>
    )
};

export default BoardProvider;
