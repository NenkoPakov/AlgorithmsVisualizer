export interface INode {
    row: number,
    col: number,
    dispatch: Function,
}

export interface ITargetNode extends INode {
    // handleAlgorithm: Function
}

export interface IFreeNode extends INode {
    value?:number,
    isVisited?: boolean,
    isPartOfThePath?: boolean,
}

export interface INodeFactory extends INode {
    value: number,
    isVisited: boolean,
    isWall: boolean,
    isPartOfThePath: boolean,
    isStart: boolean,
    isFinish: boolean,
}

export enum NodeType {
    'start', 'finish', 'wall', 'free'
};

export type NodeColor = 'black' | 'green' | 'blue' | 'lightblue' | 'lightgrey' | 'yellow';

export interface Node {
    row: number,
    col: number
}