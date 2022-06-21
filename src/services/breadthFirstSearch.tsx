import { start } from 'repl';
import { Matrix } from '../interfaces/Board.interface';
import {Node,ICell} from '../interfaces/Cell.interface';

export const _setDelay = (millis:number) => {
    return new Promise((resolve) => setTimeout(resolve, millis));
};    

const _checkIfIsValidCell = (matrix:Matrix, row:number, col:number) => {
    if (row < 0 || col < 0 || row >= matrix.length || col >= matrix[row].length) {
        return false;
    }

    return true;
}

const breadthFirstSearch = async (matrix:Matrix, startNode:Node, isFirstExecution:boolean, updateNodeFunc:Function, setComeFrom:Function) => {
    let tempMatrix:any= matrix.map((row:ICell[])=> row.map((node:ICell)=> {return {row:node.row,col:node.col,isVisited:false,isWall:node.isWall}}));
    
    const frontier:Node[] = [];
    frontier.push(startNode);

    const comeFrom:{ [name: string]: string|undefined} = {};
    comeFrom[`${startNode.row}-${startNode.col}`] = undefined;

    while (frontier.length) {
        const currentNode:Node = frontier.shift()!;

        tempMatrix[currentNode.row][currentNode.col].isVisited = true;
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
            const neighborNode = tempMatrix[neighbor.row][neighbor.col];
            if (comeFrom.hasOwnProperty(`${neighbor.row}-${neighbor.col}`) || neighborNode.isVisited||neighborNode.isWall||neighborNode.isFinish||neighborNode.isStart) {
                return;
            }

            frontier.push(neighbor);
            comeFrom[`${neighbor.row}-${neighbor.col}`] = `${currentNode.row}-${currentNode.col}`
        });
    }

    setComeFrom(comeFrom);
};

export default breadthFirstSearch