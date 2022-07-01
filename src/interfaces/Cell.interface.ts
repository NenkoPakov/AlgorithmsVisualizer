export interface ICell  {
    row: number,
    col: number,
    handleClick:any,
}

export interface IFreeCell extends ICell  {
    isVisited?:boolean,
    isPartOfThePath?:boolean,
}

export interface ICell2  {
    isVisited: boolean,
    isWall: boolean,
    isPartOfThePath:boolean,
    isStart:boolean,
    isFinish:boolean,
    row: number,
    col: number,
    handleClick:any,
    pressedCellType:CellType,
}

export type CellColor= 'black'|'green'|'blue'|'lightblue';

export interface CellTypeColor {
  wall:CellColor,
  start:CellColor,
  finish:CellColor,
  free:CellColor,
};

export type CellType="start"|"finish"|"wall"|"free"


export interface Node { 
    row: number,
    col: number 
}