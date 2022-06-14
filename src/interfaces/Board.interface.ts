import {Cell} from './Cell.interface';

export type MatrixKey = "isWall" | "isPartOfThePath" | "isVisited";

export type MatrixRow=Cell[];
export type Matrix=MatrixRow[];
