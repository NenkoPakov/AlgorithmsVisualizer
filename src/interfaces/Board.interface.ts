import {ICell} from './Cell.interface';

export type MatrixKey = "isWall" | "isPartOfThePath" | "isVisited"| "isStart"| "isFinish";

export type MatrixRow=ICell[];
export type Matrix=MatrixRow[];
