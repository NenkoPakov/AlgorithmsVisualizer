export interface ICell  {
    isVisited: boolean,
    isWall: boolean,
    isPartOfThePath:boolean,
    isStart:boolean,
    isFinish:boolean,
    row: number,
    col: number,
    handleClick:any
}


export interface Node { 
    row: number,
    col: number 
}