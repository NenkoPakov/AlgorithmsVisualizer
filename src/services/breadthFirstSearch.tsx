import { Node } from '../interfaces/Cell.interface';

const _checkIfIsValidCell = (matrix: boolean[][], row: number, col: number) => {
    if (row < 0 || col < 0 || row >= matrix.length || col >= matrix[row].length) {
        return false;
    }

    return true;
}

//Clear whole matrix if start or finish nodes are over new area or over wall
const breadthFirstSearch = async (wallMatrix: boolean[][], startNode: Node, finishNode: Node) => {
    let tempMatrix: any = wallMatrix.map((row: boolean[], rowIndex: number) => row.map((isWall: boolean, colIndex: number) => {
        return {
            row: rowIndex, col: colIndex, isVisited: false, isWall:
            //ensure finish node is not marked with true in wallNodes matrix
                (finishNode.row == rowIndex && finishNode.col == colIndex ? false : isWall)
        }
    }));

    const frontier: Node[] = [];
    frontier.push(startNode);

    const comeFrom: { [name: string]: string | undefined } = {};
    comeFrom[`${startNode.row}-${startNode.col}`] = undefined;

    while (frontier.length) {
        const currentNode: Node = frontier.shift()!;

        tempMatrix[currentNode.row][currentNode.col].isVisited = true;
        const graphNeighbors: Node[] = [];

        if (_checkIfIsValidCell(wallMatrix, currentNode.row - 1, currentNode.col)) {
            graphNeighbors.push({ row: currentNode.row - 1, col: currentNode.col });
        }

        if (_checkIfIsValidCell(wallMatrix, currentNode.row + 1, currentNode.col)) {
            graphNeighbors.push({ row: currentNode.row + 1, col: currentNode.col });
        }

        if (_checkIfIsValidCell(wallMatrix, currentNode.row, currentNode.col - 1)) {
            graphNeighbors.push({ row: currentNode.row, col: currentNode.col - 1 });
        }

        if (_checkIfIsValidCell(wallMatrix, currentNode.row, currentNode.col + 1)) {
            graphNeighbors.push({ row: currentNode.row, col: currentNode.col + 1 });
        }

        graphNeighbors.forEach(neighbor => {
            const neighborNode = tempMatrix[neighbor.row][neighbor.col];
            if (comeFrom.hasOwnProperty(`${neighbor.row}-${neighbor.col}`) || neighborNode.isVisited || neighborNode.isWall || neighborNode.isFinish || neighborNode.isStart) {
                return;
            }

            frontier.push(neighbor);
            comeFrom[`${neighbor.row}-${neighbor.col}`] = `${currentNode.row}-${currentNode.col}`
        });
    }

    return comeFrom;
};

export default breadthFirstSearch