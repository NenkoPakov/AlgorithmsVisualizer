import React from 'react';
import Wall from "../components/Wall"
import Start from "../components/Start"
import Finish from "../components/Finish"
import Free from "../components/Free"

export function createNode(value: number, row: number, col: number, type: string, dispatch: Function) {
    switch (type) {
        case "wall":
            return <Wall key={`cell-wall-${row}-${col}`} row={row} col={col} dispatch={dispatch} />;
        case "start":
            return <Start key={`cell-start-${row}-${col}`} row={row} col={col} dispatch={dispatch} />;
        case "finish":
            return <Finish key={`cell-finish-${row}-${col}`} row={row} col={col} dispatch={dispatch} />;
        case "path":
            return <Free key={`cell-free-${row}-${col}`} row={row} col={col} dispatch={dispatch} isPartOfThePath={true} value={value} />;
        case "frontier":
            return <Free key={`cell-free-${row}-${col}`} row={row} col={col} dispatch={dispatch} isVisited={true} isFrontier={true} value={value} />;
        case "visited":
            return <Free key={`cell-free-${row}-${col}`} row={row} col={col} dispatch={dispatch} isVisited={true} value={value} />;
        default:
            return <Free key={`cell-free-${row}-${col}`} row={row} col={col} dispatch={dispatch} />;
    }
}