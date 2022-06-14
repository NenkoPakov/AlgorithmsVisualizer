import { Matrix } from '../interfaces/Board.interface';
import {Node} from '../interfaces/Cell.interface';

const _setDelay = (millis:number) => {
    return new Promise((resolve) => setTimeout(resolve, millis));
};    

const _checkIfIsValidCell = (matrix:Matrix, row:number, col:number) => {
    if (row < 0 || col < 0 || row >= matrix.length || col >= matrix[row].length) {
        return false;
    }

    return true;
}

const breadthFirstSearch = async (matrix:Matrix, startNode:Node, targetNode:Node, updateNodeFunc:any) => {
    const frontier:Node[] = [];
    frontier.push(startNode);

    const comeFrom:{ [name: string]: string|undefined} = {};
    comeFrom[`${startNode.row}-${startNode.col}`] = undefined;

    while (frontier.length) {
        const currentNode:Node = frontier.shift()!;

        updateNodeFunc(currentNode.row, currentNode.col, 'isVisited');
        await _setDelay(5);
        const graphNeighbors:Node[] = [];

        if (_checkIfIsValidCell(matrix, currentNode.row - 1, currentNode.col)) {
            graphNeighbors.push({ row: currentNode.row - 1, col: currentNode.col });
        }

        if (_checkIfIsValidCell(matrix, currentNode.row + 1, currentNode.col)) {
            graphNeighbors.push({ row: currentNode.row + 1, col: currentNode.col });
        }

        if (_checkIfIsValidCell(matrix, currentNode.row, currentNode.col - 1)) {
            graphNeighbors.push({ row: currentNode.row, col: currentNode.col - 1 });
        }

        if (_checkIfIsValidCell(matrix, currentNode.row, currentNode.col + 1)) {
            graphNeighbors.push({ row: currentNode.row, col: currentNode.col + 1 });
        }

        graphNeighbors.forEach(neighbor => {
            if (comeFrom.hasOwnProperty(`${neighbor.row}-${neighbor.col}`)) {
                return;
            }

            frontier.push(neighbor);
            comeFrom[`${neighbor.row}-${neighbor.col}`] = `${currentNode.row}-${currentNode.col}`
        });
    }

    // let currentNode = `${targetNode.row}-${targetNode.col}`;
    let currentNode:string|undefined = comeFrom[`${targetNode.row}-${targetNode.col}`];
    const path:string[] = [];
    while (currentNode) {
        path.push(currentNode);

        let currentNodeDate = currentNode.split('-');
        console.log(currentNodeDate);
        let row = currentNodeDate[0];
        let col = currentNodeDate[1];

        updateNodeFunc(row, col, 'isPartOfThePath');
        await _setDelay(80);

        currentNode = comeFrom[currentNode];
    }

    path.push(`${startNode.row}-${startNode.col}`);
};

export default breadthFirstSearch