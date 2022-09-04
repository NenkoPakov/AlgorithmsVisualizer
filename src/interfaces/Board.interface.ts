import { Algorithm } from "../global"
import { Node } from "./Cell.interface"

export interface State {
    visitedNodes: boolean[][],
    frontierNodes: boolean[][],
    pathNodes: boolean[][],
    nodeValues: number[][],
    foundPath: Node[],
    algorithmResult: AlgorithmResult[],
};

export interface BoardProps {
    startNode:Node,
    finishNode:Node,
    algorithmKey: keyof typeof Algorithm,
    boardRows: number,
    boardCols: number,
    wallNodes:boolean[][],
    boardManagerDispatch:Function,
    delayFunc:Function,
};

export interface AlgorithmData {
    parent: string | undefined,
    value: number,
}

export interface AlgorithmResult {
    [name: string]: AlgorithmData
}

