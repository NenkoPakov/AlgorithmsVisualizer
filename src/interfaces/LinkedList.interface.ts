import { Node } from "./Cell.interface";

export interface NodeData {
    node:Node,
    value:number,
}

export interface LinkedList{
    previous?:NodeData,
    current:NodeData,
    next?:NodeData,
}

