import {Node} from './Cell.interface'

export enum DelayType {
    'small', 'medium', 'large'
};

export enum StatusType {
    'ready', 'paused', 'running', 'done'
};

export interface State {
    boardRows: number,
    boardCols: number,
    startNode: Node,
    finishNode: Node,
    wallNodes: boolean[][],
    wallSelectionStartNode: Node,
    proposedWall: Node[],
    draggedNodePosition: Node,
    delay: string,
    // foundPath: boolean | undefined,
}