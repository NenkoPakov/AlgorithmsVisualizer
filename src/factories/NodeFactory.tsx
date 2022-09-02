import React from 'react';
import Wall from "../components/Wall"
import Start from "../components/Start"
import Finish from "../components/Finish"
import Free from "../components/Free"

export function createNode(value: number, row: number, col: number, type: string, boardManagerDispatch: Function) {
    switch (type) {
        case "wall":
            return <Wall key={`cell-wall-${row}-${col}`} row={row} col={col} boardManagerDispatch={boardManagerDispatch} />;
        case "start":
            return <Start key={`cell-start-${row}-${col}`} row={row} col={col} boardManagerDispatch={boardManagerDispatch} />;
        case "finish":
            return <Finish key={`cell-finish-${row}-${col}`} row={row} col={col} boardManagerDispatch={boardManagerDispatch} />;
        case "path":
            return <Free key={`cell-free-${row}-${col}`} row={row} col={col} boardManagerDispatch={boardManagerDispatch} isPartOfThePath={true} value={value} />;
        case "frontier":
            return <Free key={`cell-free-${row}-${col}`} row={row} col={col} boardManagerDispatch={boardManagerDispatch} isVisited={true} isFrontier={true} value={value} />;
        case "visited":
            return <Free key={`cell-free-${row}-${col}`} row={row} col={col} boardManagerDispatch={boardManagerDispatch} isVisited={true} value={value} />;
        default:
            return <Free key={`cell-free-${row}-${col}`} row={row} col={col} boardManagerDispatch={boardManagerDispatch} />;
    }
}