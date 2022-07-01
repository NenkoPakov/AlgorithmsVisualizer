import Cell from './Cell';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import breadthFirstSearch, { _setDelay } from '../services/breadthFirstSearch';
import { MatrixKey, Matrix, MatrixRow } from '../interfaces/Board.interface';
import { CellType, ICell2, Node, } from '../interfaces/Cell.interface';

const Center = styled.div`
position:absolute;
left: 50%;
transform: translate(-50%, 0%);
`;

const BoardWrapper = styled(Center)`
width:80vw;
height:80vh;
position:relative;

display: grid;
grid-template-rows:repeat(20,1fr);
grid-template-columns: repeat(20, 1fr);

border:5px solid black;
`;

function Board() {
    const rows = 20;
    const cols = 20;

    const [matrix, setMatrix] = useState<Matrix>([]);
    const [startNode, setStartNode] = useState<Node>({ row: 0, col: 0 });
    const [finishNode, setFinishNode] = useState<Node>({ row: rows - 1, col: cols - 1 });
    const [isMousePressed, setIsMousePressed] = useState<boolean>(false);
    const [proposedWall, setProposedWall] = useState<Node[]>([]);
    const [wallSelectionStartNode, setWallSelectionStartNode] = useState<Node>({ row: -1, col: -1 });
    const [pressedCellType, setPressedCellType] = useState<CellType>('free');
    const [comeFrom, setComeFrom] = useState<{ [name: string]: string | undefined }>({});
    const [foundPath, setFoundPath] = useState<Node[]>([]);
    const [visitedNodes, setVisitedNodes] = useState<Node[]>([]);

    const executeAlgorithm = () => {
        setComeFrom(breadthFirstSearch(matrix, startNode));
    };

    const cleanBoard = () => {
        setMatrix(generateClearBoard());
        setIsMousePressed(false);
        setWallSelectionStartNode({ row: -1, col: -1 });
        setComeFrom({});
        setFoundPath([]);
        setVisitedNodes([]);
    };

    const handleMouseClick = (event: MouseEvent, row: number, col: number) => {
        switch (event.type) {
            //set isMousePressed to true and set currently pressedCellType
            case "mousedown":
                console.log("mousedown")
                const selectedNode = matrix[row][col];
                const selectedNodeType = startNode.row == row && startNode.col == col
                    ? "start"
                    : finishNode.row == row && finishNode.col == col
                        ? "finish"
                        : selectedNode.isWall
                            ? "wall"
                            : "free";

                setPressedCellType(selectedNodeType);
                setIsMousePressed(true);
                break;
            //set isMousePressed to false. If current startNode or finishNode are placed in new area - clear all visited and path cells
            case "mouseup":
                setIsMousePressed(false);

                //if is not visited(could be wall or not visited cell)
                if (!matrix[row][col].isVisited && ['start', 'finish'].includes(pressedCellType)) {
                    setMatrix(matrix.map((row: ICell2[]) => row.map((node: ICell2) => { return { ...node, isVisited: false, isPartOfThePath: false } })));
                }

                //update startNode or finishNode and fulfill the condition is useEffect[startNode,finishNode]
                switch (pressedCellType) {
                    case "start":
                        let currentStartNode: Node = { row: row, col: col };
                        setStartNode(() => currentStartNode);
                        break;
                    case "finish":
                        let currentFinishNode: Node = { row: row, col: col };
                        setFinishNode(() => currentFinishNode);
                        break;
                }

                break;
            //generate a new wall
            case "click":
                let currentNode: Node = { row: row, col: col };

                //cancel wall generation if click at last created cell as wall
                if (wallSelectionStartNode && wallSelectionStartNode.row === row && wallSelectionStartNode.col === col) {
                    setWallSelectionStartNode({ row: -1, col: -1 });
                    break;
                }

                //Create a wall
                // if (wallSelectionStartNode.row < 0 && wallSelectionStartNode.col < 0) {
                if (!proposedWall.length) {
                    //If start new wall selection, then mark pressed node as wall
                    updateMatrixNode(row, col, 'isWall');
                } else {
                    // setProposedWall([]);
                    generateWall(row, col);
                }

                setWallSelectionStartNode(currentNode);
                break;
            //interactive wall, startNode and finishNode updating
            default:
                //generate proposal walls
                if (!isMousePressed) {
                    if ((pressedCellType == 'wall' || pressedCellType == 'free') && wallSelectionStartNode.row >= 0 && wallSelectionStartNode.col >= 0) {
                        proposedWall.forEach(node => updateMatrixNode(node.row, node.col, 'isWall'))
                        setProposedWall(generateWall(row, col));
                    }

                    return;
                }

                //move start or finish node while holding mouse left button 
                switch (pressedCellType) {
                    case "start":
                        let currentStartNode: Node = { row: row, col: col };
                        setStartNode(() => currentStartNode);
                        break;
                    case "finish":
                        let currentFinishNode: Node = { row: row, col: col };
                        setFinishNode(() => currentFinishNode);
                        break;
                    default:
                        break;
                }
                break;
        }
    }

    //change property of a node
    const updateMatrixNode = (targetRow: number, targetCol: number, properyKey: MatrixKey) => {
        setMatrix((m) => {

            const newMatrix: Matrix = [...m];
            const newTargetRow: MatrixRow = [...newMatrix[targetRow]];

            const currentValue = newTargetRow[targetCol][`${properyKey}`];
            newTargetRow[targetCol] = { ...newTargetRow[targetCol], [`${properyKey}`]: !currentValue };

            newMatrix[targetRow] = newTargetRow;
            return newMatrix;
        });
    };

    //set a specific property of each node to false(unmark it)
    const clearPerviousStateMatrixProperty = (propertyKey: MatrixKey) => {
        setMatrix(matrix.map(row => row.map(node => { return { ...node, [`${propertyKey}`]: false } })));
    };

    //initialize the matrix
    useEffect(() => {
        setMatrix(generateClearBoard());
    }, [])

    //execute the algorithm if startNode or finishNode change its position
    useEffect(() => {
        if (visitedNodes.length && !isMousePressed) {
            setComeFrom(breadthFirstSearch(matrix, startNode));
        }
    }, [startNode, finishNode])

    //marks all visited nodes and update the state of setFoundPath
    useEffect(() => {
        (async () => {
            //the algorithm has been updated again, so we have to clear the last found path
            if (visitedNodes.length) {
                clearPerviousStateMatrixProperty('isPartOfThePath');
            }

            //if the startNode is placed outside of the already visited area, then the algorithm will be executed again with a _setDelay
            if (!visitedNodes.length || !visitedNodes.some(node => node.row === startNode.row && node.col === startNode.col)) {
                const recentlyVisitedNodes: Node[] = Object.keys(comeFrom).map(node => {
                    let currentNodeData = node.split('-');
                    let row = parseInt(currentNodeData[0]);
                    let col = parseInt(currentNodeData[1]);

                    return { row: row, col: col };
                });

                //TODO: check if this is needed
                if (visitedNodes.length) {
                    clearPerviousStateMatrixProperty('isVisited');
                }

                setVisitedNodes(recentlyVisitedNodes);
                for (const node of recentlyVisitedNodes) {
                    updateMatrixNode(node.row, node.col, 'isVisited');
                    await _setDelay(5);
                }
            }

            //TODO: check if this is needed
            //unmark previous path
            // foundPath.forEach(node => {
            //     updateMatrixNode(node.row, node.col, "isPartOfThePath");
            // });

            //go through each node from comeFrom until the startNode is not reached
            let currentNode: string | undefined = comeFrom[`${finishNode.row}-${finishNode.col}`];
            let startNodeText: string = `${startNode.row}-${startNode.col}`;
            const path: Node[] = [];

            while (currentNode != startNodeText && currentNode) {
                let currentNodeData = currentNode.split('-');
                let row = parseInt(currentNodeData[0]);
                let col = parseInt(currentNodeData[1]);

                // updateMatrixNode(row, col, "isPartOfThePath");
                // if (!visitedNodes.length) {
                //     await _setDelay(5);
                // }

                path.push({ row: row, col: col });

                currentNode = comeFrom[currentNode];
            }

            setFoundPath(path);
        })();
    }, [comeFrom]);

    //mark the path
    useEffect(() => {
        (async () => {
            for (const node of foundPath) {
                updateMatrixNode(node.row, node.col, "isPartOfThePath");

                if (!visitedNodes.length) {
                    await _setDelay(5);
                }
            }
        })();

    }, [foundPath]);

    return (<React.Fragment>
        <button onClick={() => executeAlgorithm()}>Execute</button>
        <button onClick={() => cleanBoard()}>Clear board</button>
        <BoardWrapper>
            {matrix.map((row, rowIndex) => (
                row.map((node, colIndex) => {

                    let isStartNode = rowIndex === startNode.row && colIndex === startNode.col;
                    let isFinishNode = rowIndex === finishNode.row && colIndex === finishNode.col;

                    return <Cell
                        isVisited={node.isVisited}
                        isWall={node.isWall}
                        isPartOfThePath={node.isPartOfThePath}
                        isStart={isStartNode}
                        isFinish={isFinishNode}
                        row={node.row}
                        col={node.col}
                        handleClick={handleMouseClick}
                        pressedCellType={pressedCellType}
                    ></Cell>
                })
            ))}
        </BoardWrapper>
    </React.Fragment>
    );

    function generateClearBoard() {
        let newMatrix = Array(rows);
        for (let row = 0; row < rows; row++) {
            newMatrix[row] = Array(cols);
            for (let col = 0; col < cols; col++) {
                newMatrix[row][col] = {
                    isVisited: false,
                    isWall: false,
                    isPartOfThePath: false,
                    row: row,
                    col: col,
                };
            }
        }
        return newMatrix;
    }

    function generateWall(row: number, col: number) {
        const changedCells: Node[] = [];
        let previousNodeRow = wallSelectionStartNode.row;
        let previousNodeCol = wallSelectionStartNode.col;

        let verticalDirectionSign = previousNodeRow > row ? -1 : +1;
        let horizontalDirectionSign = previousNodeCol > col ? -1 : +1;

        while (previousNodeRow != row && previousNodeCol != col) {
            previousNodeRow += verticalDirectionSign;
            previousNodeCol += horizontalDirectionSign;

            changedCells.push({ row: previousNodeRow, col: previousNodeCol });
            updateMatrixNode(previousNodeRow, previousNodeCol, 'isWall');
        }

        while (previousNodeRow != row) {
            previousNodeRow += verticalDirectionSign;

            changedCells.push({ row: previousNodeRow, col: previousNodeCol });
            updateMatrixNode(previousNodeRow, previousNodeCol, 'isWall');
        }

        while (previousNodeCol != col) {
            previousNodeCol += horizontalDirectionSign;

            changedCells.push({ row: previousNodeRow, col: previousNodeCol });
            updateMatrixNode(previousNodeRow, previousNodeCol, 'isWall');
        }

        return changedCells;
    }
}

export default Board;
