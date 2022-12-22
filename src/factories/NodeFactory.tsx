import React from 'react';
import Wall from "../components/Cells/Wall"
import Start from "../components/Cells/Start"
import Finish from "../components/Cells/Finish"
import Free from "../components/Cells/Free"

export function createNode(value: number,sideLength:string, row: number, col: number, type: string, boardManagerDispatch: Function) {
    switch (type) {
        case "wall":
            return <Wall sideLength={sideLength} key={`cell-wall-${row}-${col}`} row={row} col={col} boardManagerDispatch={boardManagerDispatch} />;
        case "start":
            return <Start sideLength={sideLength} key={`cell-start-${row}-${col}`} row={row} col={col} boardManagerDispatch={boardManagerDispatch} />;
        case "finish":
            return <Finish sideLength={sideLength} key={`cell-finish-${row}-${col}`} row={row} col={col} boardManagerDispatch={boardManagerDispatch} />;
        case "path":
            return <Free sideLength={sideLength} key={`cell-free-${row}-${col}`} row={row} col={col} boardManagerDispatch={boardManagerDispatch} isPartOfThePath={true} value={value} />;
        case "frontier":
            return <Free sideLength={sideLength} key={`cell-free-${row}-${col}`} row={row} col={col} boardManagerDispatch={boardManagerDispatch} isVisited={true} isFrontier={true} value={value} />;
        case "visited":
            return <Free sideLength={sideLength} key={`cell-free-${row}-${col}`} row={row} col={col} boardManagerDispatch={boardManagerDispatch} isVisited={true} value={value} />;
        default:
            return <Free sideLength={sideLength} key={`cell-free-${row}-${col}`} row={row} col={col} boardManagerDispatch={boardManagerDispatch} />;
    }
}