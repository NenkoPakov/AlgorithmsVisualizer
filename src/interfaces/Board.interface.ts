import {ICell2} from './Cell.interface';

export type MatrixKey = "isWall" | "isPartOfThePath" | "isVisited"| "isStart"| "isFinish";

export interface Props {
    // rows:number,
    // cols:number
    size:number
};

export type MatrixRow=ICell2[];
export type Matrix=MatrixRow[];
