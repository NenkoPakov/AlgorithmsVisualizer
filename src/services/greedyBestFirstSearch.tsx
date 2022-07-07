import { ComeFrom } from '../interfaces/Board.interface';
import { Node } from '../interfaces/Cell.interface';
import { getValidNeighbors, areEqual } from './common';

const heuristic = (targetNode: Node, currentNode: Node) => {
    let { row: targetRow, col: targetCol } = targetNode;
    let { row: currentRow, col: currentCol } = currentNode;

    // Manhattan distance on a square grid
    return Math.abs(targetRow - currentRow) + Math.abs(targetCol - currentCol);
}

const greedyBestFirstSearch = async (wallMatrix: boolean[][], startNode: Node, finishNode: Node) => {
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

        graphNeighbors.forEach(neighbor => {
            tempMatrix[neighbor.row][neighbor.col].isVisited = true;

            const priority = heuristic(finishNode, neighbor);
            frontier.push({ node: neighbor, priority });
            comeFrom[`${neighbor.row}-${neighbor.col}`] = { parent: `${currentNode.node.row}-${currentNode.node.col}`, value: priority }

            if (areEqual(neighbor, finishNode)) isTargetFound = true;
        });

        frontier.sort((prev, next) => prev.priority - next.priority);
    }

    return comeFrom;
};

export default greedyBestFirstSearch;
