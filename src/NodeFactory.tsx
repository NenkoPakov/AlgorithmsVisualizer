import React from 'react';
import Wall from "../src/components/Wall"
import Start from "../src/components/Start"
import Finish from "../src/components/Finish"
import Free from "../src/components/Free"

export function createNode(row: number, col: number, type: string, handleClick: Function) {
    switch (type) {
        case "wall":
            return <Wall row={row} col={col} handleClick={handleClick} />;
        case "start":
            return <Start row={row} col={col} handleClick={handleClick} />;
        case "finish":
            return <Finish row={row} col={col} handleClick={handleClick} />;
        case "path":
            return <Free row={row} col={col} handleClick={handleClick} isPartOfThePath={true} />;
        case "visited":
            return <Free row={row} col={col} handleClick={handleClick} isVisited={true} />;
        default:
            return <Free row={row} col={col} handleClick={handleClick} />;
    }
}