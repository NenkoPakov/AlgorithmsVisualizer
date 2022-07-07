import { Node } from '../interfaces/Cell.interface';
import { areEqual, getValidNeighbors } from './common';

const breadthFirstSearch = async (wallMatrix: boolean[][], startNode: Node, finishNode: Node) => {
    let tempMatrix: any = wallMatrix.map((row: boolean[], rowIndex: number) => row.map((isWall: boolean, colIndex: number) => {
        return {
            row: rowIndex,
            col: colIndex,
            isVisited: false,
            //ensure finish node is not marked with true in wallNodes matrix
            isWall: (finishNode.row == rowIndex && finishNode.col == colIndex ? false : isWall)
        }
    }));

    const frontier: Node[] = [];
    frontier.push(startNode);

    const comeFrom: { [name: string]: string | undefined } = {};
    comeFrom[`${startNode.row}-${startNode.col}`] = undefined;

    let isTargetFound = false;

    while (frontier.length && !isTargetFound) {
        const currentNode: Node = frontier.shift()!;

        tempMatrix[currentNode.row][currentNode.col].isVisited = true;
        const graphNeighbors: Node[] = getValidNeighbors(tempMatrix, currentNode);

        graphNeighbors.forEach(neighbor => {
            frontier.push(neighbor);
            tempMatrix[neighbor.row][neighbor.col].isVisited = true;
            comeFrom[`${neighbor.row}-${neighbor.col}`] = `${currentNode.row}-${currentNode.col}`

            if (areEqual(neighbor, finishNode)) isTargetFound = true;
        });
    }

    return comeFrom;
};

export default breadthFirstSearch



