import { Node } from '../interfaces/Cell.interface';
import breadthFirstSearch from './breadthFirstSearch';
import greedyBestFirstSearch from './greedyBestFirstSearch';

export const Algorithms = {
    'BFS': breadthFirstSearch,
    'Greedy Best FS': greedyBestFirstSearch,
}

export const getValidNeighbors = (matrix: any, currentNode: Node) => {
    const graphNeighbors: Node[] = [];

    const possibleNeighborsDirections = {
        up: { row: -1, col: 0 },
        right: { row: 0, col: +1 },
        down: { row: +1, col: 0 },
        left: { row: 0, col: -1 },
    };

    Object.values(possibleNeighborsDirections).forEach(({ row: rowDirection, col: colDirection }) => {
        let contenderRow = currentNode.row + rowDirection;
        let contenderCol = currentNode.col + colDirection;

        if (!checkIfIsValidCell(matrix, contenderRow, contenderCol)) return;

        graphNeighbors.push({ row: contenderRow, col: contenderCol });
    })

    return graphNeighbors;
};

export const checkIfIsValidCell = (matrix: any, row: number, col: number) => {
    return isInside(row, col, matrix) &&
        !matrix[row][col].isVisited &&
        !matrix[row][col].isWall;
}

export const areEqual = (firstNode: Node, secondNode: Node) => {
    return firstNode.row === secondNode.row && firstNode.col === secondNode.col
};

function isInside(row: number, col: number, matrix: any) {
    return row >= 0 &&
        col >= 0 &&
        row < matrix.length &&
        col < matrix[row].length;
}


export const heuristic = (to: Node, from: Node) => {
    let { row: targetRow, col: targetCol } = to;
    let { row: currentRow, col: currentCol } = from;

    // Manhattan distance on a square grid
    return Math.abs(targetRow - currentRow) + Math.abs(targetCol - currentCol);
}
