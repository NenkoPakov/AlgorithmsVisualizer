export interface BaseProps {
    sideLength:string,
    row: number,
    col: number,
    boardManagerDispatch: Function,
}

export interface FreeProps extends BaseProps {
    sideLength:string,
    value?: number,
    isVisited?: boolean,
    isFrontier?: boolean,
    isPartOfThePath?: boolean,
}

export interface CellProps extends BaseProps {
    value: number,
    isVisited: boolean,
    isFrontier: boolean,
    isWall: boolean,
    isPartOfThePath: boolean,
    isStart: boolean,
    isFinish: boolean,
    boardManagerDispatch: Function
}

export enum NodeType {
    'start', 'finish', 'wall', 'free'
};

export type NodeColor = 'black' | 'green' | 'blue' | 'lightblue' | 'lightgrey' | 'yellow';

export interface Node {
    row: number,
    col: number
}