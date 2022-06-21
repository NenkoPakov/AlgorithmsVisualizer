import Cell from './Cell';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import styled from 'styled-components';
import breadthFirstSearch, { _setDelay } from '../services/breadthFirstSearch';

import { MatrixKey, Matrix, MatrixRow } from '../interfaces/Board.interface';
import { CellType, Node, } from '../interfaces/Cell.interface';

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
    const [wallSelectionStartNode, setWallSelectionStartNode] = useState<Node>({ row: -1, col: -1 });
    const [pressedCellType, setPressedCellType] = useState<string>("");
    const [comeFrom, setComeFrom] = useState<{ [name: string]: string | undefined }>({});
    const [foundPath, setFoundPath] = useState<Node[]>([]);
    const [isFirstExecution, setIsFirstExecution] = useState<boolean>(true);

    const getPathToFinishNode = async () => {
        await breadthFirstSearch(matrix, startNode, isFirstExecution, updateMatrixNode, setComeFrom);

        setIsFirstExecution(false);
    };

    const handleMouseClick = (event: MouseEvent, row: number, col: number) => {
        switch (event.type) {
            case "mousedown":
                const selectedNode = matrix[row][col];
                const selectedNodeType = selectedNode.isWall
                    ? "wall"
                    : startNode.row == row && startNode.col == col
                        ? "start"
                        : finishNode.row == row && finishNode.col == col
                            ? "finish"
                            : "free";

                setPressedCellType(selectedNodeType);
                setIsMousePressed(true);
                break;
            case "mouseup":
                setIsMousePressed(false);
                break;
            case "click":
                let currentNode: Node = { row: row, col: col };

                if (wallSelectionStartNode && wallSelectionStartNode.row === row && wallSelectionStartNode.col === col) {
                    setWallSelectionStartNode({ row: -1, col: -1 });
                    break;
                }

                if (wallSelectionStartNode.row < 0 || wallSelectionStartNode.col < 0) {
                    updateMatrixNode(row, col, 'isWall');
                } else {
                    generateWall(row, col);
                }

                setWallSelectionStartNode(currentNode);
                break;
            default:
                if (!isMousePressed)
                    return;

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
                        updateMatrixNode(row, col, 'isWall');
                        break;
                }
                break;
        }
    }

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

    useEffect(() => {
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
                }
            }
        }

        setMatrix(newMatrix);
    }, [])

    useEffect(() => {
        const markNodesAsVisited = async () => {
            const visitedNodes = Object.keys(comeFrom);
            if (isFirstExecution) {
                for (const node of visitedNodes) {
                    let currentNodeData = node.split('-');
                    let row = parseInt(currentNodeData[0]);
                    let col = parseInt(currentNodeData[1]);

                    updateMatrixNode(row, col, 'isVisited');
                    if (isFirstExecution) {
                        await _setDelay(5);
                    }
                }
            }

            //unmark previous path
            foundPath.forEach(node => {
                updateMatrixNode(node.row, node.col, "isPartOfThePath");
            });

            let currentNode: string | undefined = comeFrom[`${finishNode.row}-${finishNode.col}`];
            let startNodeText: string = `${startNode.row}-${startNode.col}`;
            const path: Node[] = [];

            while (currentNode != startNodeText && currentNode) {
                let currentNodeData = currentNode.split('-');
                let row = parseInt(currentNodeData[0]);
                let col = parseInt(currentNodeData[1]);

                updateMatrixNode(row, col, "isPartOfThePath");
                if (isFirstExecution) {
                    await _setDelay(5);
                }

                path.push({ row: row, col: col });

                currentNode = comeFrom[currentNode];
            }

            setFoundPath(path);
        };

        markNodesAsVisited();
    }, [comeFrom]);

    useEffect(() => {
        if (!isFirstExecution) {
            breadthFirstSearch(matrix, startNode, isFirstExecution, updateMatrixNode, setComeFrom);
        }
    }, [startNode, finishNode])

    useEffect(() => {

    }, [foundPath])


    return (<React.Fragment>
        <button onClick={() => getPathToFinishNode()}>Find</button>
        <BoardWrapper>
            {matrix.map((row, rowIndex) => (
                row.map((node, colIndex) => {

                    let isStartNode = rowIndex === startNode.row && colIndex === startNode.col;
                    let isFinishNode = rowIndex === finishNode.row && colIndex === finishNode.col;

                    return <Cell
                        isVisited={node.isVisited}
                        isWall={node.isWall}
                        isPartOfThePath={node.isPartOfThePath}
                        // isStart={node.isStart}
                        // isFinish={node.isFinish}
                        isStart={isStartNode}
                        isFinish={isFinishNode}
                        row={node.row}
                        col={node.col}
                        handleClick={handleMouseClick}
                    ></Cell>
                })
            ))}
        </BoardWrapper>
    </React.Fragment>
    );

    function generateWall(row: number, col: number) {
        let previousNodeRow = wallSelectionStartNode.row;
        let previousNodeCol = wallSelectionStartNode.col;

        let verticalDirectionSign = previousNodeRow > row ? -1 : +1;
        let horizontalDirectionSign = previousNodeCol > col ? -1 : +1;

        while (previousNodeRow != row && previousNodeCol != col) {
            previousNodeRow += verticalDirectionSign;
            previousNodeCol += horizontalDirectionSign;

            updateMatrixNode(previousNodeRow, previousNodeCol, 'isWall');
        }

        while (previousNodeRow != row) {
            previousNodeRow += verticalDirectionSign;
            updateMatrixNode(previousNodeRow, previousNodeCol, 'isWall');
        }

        while (previousNodeCol != col) {
            previousNodeCol += horizontalDirectionSign;
            updateMatrixNode(previousNodeRow, previousNodeCol, 'isWall');
        }
    }
}

export default Board;
