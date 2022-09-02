import { ComeFrom } from '../interfaces/Board.interface';
import { Node } from '../interfaces/Cell.interface';
import { getValidNeighbors, areEqual, heuristic } from './common';


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

    const comeFrom: ComeFrom[] = [];

    let isFoundPath = false;
    let currentIteration = 0;

    let obj: any = {};
    comeFrom.push(obj);
    obj[`${startNode.row}-${startNode.col}`] = { parent: undefined, value: heuristic(startNode, finishNode) };

    while (frontier.length && !isFoundPath) {
        const currentNode: { node: Node, priority: number } = frontier.shift()!;

        tempMatrix[currentNode.node.row][currentNode.node.col].isVisited = true;
        const graphNeighbors: Node[] = getValidNeighbors(tempMatrix, currentNode.node);

        currentIteration++;
        comeFrom.push({});
        
        graphNeighbors.forEach(neighbor => {
            tempMatrix[neighbor.row][neighbor.col].isVisited = true;

            const priority = heuristic(finishNode, neighbor);
            frontier.push({ node: neighbor, priority });

            comeFrom[currentIteration][`${neighbor.row}-${neighbor.col}`] = { parent: `${currentNode.node.row}-${currentNode.node.col}`, value: priority }

            if (areEqual(neighbor, finishNode)) isFoundPath = true;
        });

        frontier.sort((prev, next) => prev.priority - next.priority);

        // yield roundComeFrom;
    }


    return {result:comeFrom, isFoundPath};
};

export default greedyBestFirstSearch;
