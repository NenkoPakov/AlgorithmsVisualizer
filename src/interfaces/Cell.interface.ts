export interface Cell  {
    isVisited: boolean,
    isWall: boolean,
    isPartOfThePath:boolean,
    row: number,
    col: number,
    type: "start"|"finish"|undefined,
}

export interface Node { 
    row: number,
    col: number 
}