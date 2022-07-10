import { ComeFrom } from '../interfaces/Board.interface';
import { Node } from '../interfaces/Cell.interface';
import { areEqual, getValidNeighbors, heuristic } from './common';

function* breadthFirstSearch(wallMatrix: boolean[][], startNode: Node, finishNode: Node) {
    let tempMatrix: any = wallMatrix.map((row: boolean[], rowIndex: number) => row.map((isWall: boolean, colIndex: number) => {
        return {
            row: rowIndex,
            col: colIndex,
            isVisited: false,
            //ensure finish node is not marked with true in wallNodes matrix
            isWall: (finishNode.row == rowIndex && finishNode.col == colIndex ? false : isWall)
        }
    }));

    const frontier: { node: Node, priority: number }[] = [];
    frontier.push({ node: startNode, priority: 0 });

    const comeFrom: ComeFrom = {};
    comeFrom[`${startNode.row}-${startNode.col}`] = { parent: undefined, value: heuristic(startNode, finishNode) };

    let isTargetFound = false;

    while (frontier.length && !isTargetFound) {
        const currentNode: { node: Node, priority: number } = frontier.shift()!;

        tempMatrix[currentNode.node.row][currentNode.node.col].isVisited = true;
        const graphNeighbors: Node[] = getValidNeighbors(tempMatrix, currentNode.node);

        const roundFrontier: { node: Node, priority: number }[] = [];
        const roundComeFrom: ComeFrom = {};

        graphNeighbors.forEach(neighbor => {

            tempMatrix[neighbor.row][neighbor.col].isVisited = true;

            const priority = heuristic(startNode, neighbor);
            frontier.push({ node: neighbor, priority });
            comeFrom[`${neighbor.row}-${neighbor.col}`] = { parent: `${currentNode.node.row}-${currentNode.node.col}`, value: priority };

            roundFrontier.push({ node: neighbor, priority });
            roundComeFrom[`${neighbor.row}-${neighbor.col}`] = { parent: `${currentNode.node.row}-${currentNode.node.col}`, value: priority };

            if (areEqual(neighbor, finishNode)) isTargetFound = true;

        });

        yield { visited: roundComeFrom, frontier: roundFrontier };
    }
};

export default breadthFirstSearch



