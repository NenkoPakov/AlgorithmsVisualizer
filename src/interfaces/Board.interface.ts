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
    iteration:number, 
};

export interface ComeFromData {
    parent: string | undefined,
    value: number,
    iteration:number,
}

export interface Test {
    [name: string]: ComeFromData
}

export interface ComeFrom {
    [name: number]: Test
}
