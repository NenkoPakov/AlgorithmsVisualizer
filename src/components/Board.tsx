import Cell from './Cell';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import breadthFirstSearch from '../services/breadthFirstSearch';

import { MatrixKey, Matrix, MatrixRow } from '../interfaces/Board.interface';
import { Node } from '../interfaces/Cell.interface';

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
    const [mousePressed, setMousePressed] = useState<boolean>(false);
    const [pressedCellType, setPressedCellType] = useState<string>("");

    const markCellAsWall = (row: number, col: number) => {
        updateMatrixNode(row, col, 'isWall');
    };

    const getPathToFinishNode = () => {
        breadthFirstSearch(matrix, startNode, finishNode, updateMatrixNode);
    };

    const handleMouseClick = (event: Event, row: number, col: number) => {
        // console.log(row+"-"+col+":"+event.type)
        switch (event.type) {
            case "mousedown":
                const selectedNode = matrix[row][col];
                const selectedNodeType = selectedNode.isWall
                    ? "wall"
                    : startNode.row==row&&startNode.col==col
                        ? "start"
                        : finishNode.row==row&&finishNode.col==col
                            ? "finish"
                            : "free"

                setPressedCellType(selectedNodeType);
                setMousePressed(true);
                break;
            case "mouseup":
                setMousePressed(false);
                break;
            case "mouseenter":
                if (mousePressed) {
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
                }
                break;
        }

        // if (event.type === "mousedown") {
        //     updateMatrixNode(row, col, 'isStart');
        // }
    }

    const moveStartOrFinishNode = (event: Event, row: number, col: number) => {
        console.log(row + "-" + col)
        console.log(event.type)
        switch (event.type) {
            case "mousedown":
                setMousePressed(true);
                break;
            case "mouseup":
                setMousePressed(false);
            default:
                if (mousePressed) {
                    const a: Node = { row: row, col: col };
                    setStartNode(() => a);
                }
                break;
        }
    }

    useEffect(() => {


    }, [startNode]);

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

    // const updateStartNode = (currentRow: number, currenCol: number, targetRow: number, targetCol: number,properyKey:MatrixKey) => {
    //     setMatrix((m) => {

    //         const newMatrix: Matrix = [...m];

    //         const currentStartRow: MatrixRow = [...newMatrix[currentRow]];
    //         const currentValue = currentStartRow[targetCol][`${properyKey}`];
    //         currentStartRow[currenCol] = { ...currentStartRow[currenCol], [`${properyKey}`]: !currentValue };
    //         newMatrix[currentRow] = currentStartRow;

    //         const targetStartRow: MatrixRow = [...newMatrix[targetRow]];
    //         const targetCurrentValue = targetStartRow[targetCol][`${properyKey}`];
    //         targetStartRow[targetCol] = { ...targetStartRow[targetCol], [`${properyKey}`]: !targetCurrentValue };
    //         newMatrix[targetRow] = targetStartRow;

    //         console.log(newMatrix);

    //         return newMatrix;
    //     });
    // };

    useEffect(() => {
        let newMatrix = Array(rows);
        for (let row = 0; row < rows; row++) {
            newMatrix[row] = Array(cols);
            for (let col = 0; col < cols; col++) {
                let isStartNode = row === startNode.row && col === startNode.col;
                let isFinishNode = row === finishNode.row && col === finishNode.col;

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

    // useEffect(() => {
    //     console.log(matrix)
    // }, [matrix])

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
}

export default Board;
