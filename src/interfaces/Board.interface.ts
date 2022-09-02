import { Algorithms } from "../services/common"
import { Node } from "./Cell.interface"

export interface BoardProps {
    startNode:Node,
    finishNode:Node,
    algorithmKey: keyof typeof Algorithms,
    boardRows: number,
    boardCols: number,
    wallNodes:boolean[][],
    parentDispatch:Function,
    delayFunc:Function,
};

export interface ComeFromData {
    parent: string | undefined,
    value: number,
}

export interface ComeFrom {
    [name: string]: ComeFromData
}
