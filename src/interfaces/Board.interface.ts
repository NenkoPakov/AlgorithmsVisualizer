import {ICell2} from './Cell.interface';

export type MatrixKey = "isWall" | "isPartOfThePath" | "isVisited"| "isStart"| "isFinish";

export type MatrixRow=ICell2[];
export type Matrix=MatrixRow[];
