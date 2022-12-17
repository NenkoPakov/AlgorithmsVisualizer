export interface BoardData {
    currentIteration: number
    isCompleted: boolean
    iterationsCount?: number
    duration?: string
}

export interface Boards {
    [name: string]: BoardData
}

export interface State {
    isDrawingWallAction: boolean,
    isUnmarkWallAction: boolean,
    isInExecution: boolean,
    isPaused: boolean,
    boards: Boards,
    isFoundPath?: boolean,
    //showNumbers:boolean
}

export interface BoardContextProvider extends State {
    cancellationToken: { current: boolean }
}

export interface BoardUpdateContextProvider {
    dispatch: Function,
    handleCancellationToken: Function,
}
