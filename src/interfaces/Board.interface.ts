import { Node } from "./Cell.interface"

export interface BoardProps {
    startNode:Node,
    finishNode:Node,
    algorithmFunc: Function,
    delayFunc: Function,
    boardRows: number,
    boardCols: number,
    wallNodes:boolean[][],
    recentlyVisitedNodes:{ frontier: Node, parent: Node | undefined, value: number }[],
    parentDispatch:Function,
};

export interface ComeFromData {
    parent: string | undefined,
    value: number,
}

export interface ComeFrom {
    [name: string]: ComeFromData
}
