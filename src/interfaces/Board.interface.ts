import { Algorithm } from "../global"
import { Node } from "./Cell.interface"

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

