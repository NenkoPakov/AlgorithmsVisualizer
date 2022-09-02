export interface INode {
    row: number,
    col: number,
    boardManagerDispatch: Function,
}

export interface ITargetNode extends INode {
    // handleAlgorithm: Function
}

export interface IFreeNode extends INode {
    value?:number,
    isVisited?: boolean,
    isFrontier?: boolean,
    isPartOfThePath?: boolean,
}

export interface INodeFactory extends INode {
    value: number,
    isVisited: boolean,
    isFrontier: boolean,
    isWall: boolean,
    isPartOfThePath: boolean,
    isStart: boolean,
    isFinish: boolean,
    boardManagerDispatch:Function
}

export enum NodeType {
    'start', 'finish', 'wall', 'free'
};

export type NodeColor = 'black' | 'green' | 'blue' | 'lightblue' | 'lightgrey' | 'yellow';

export interface Node {
    row: number,
    col: number
}