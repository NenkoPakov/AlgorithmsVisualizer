import { Node } from '../interfaces/Cell.interface';

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
