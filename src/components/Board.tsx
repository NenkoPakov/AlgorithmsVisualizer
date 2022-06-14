import Cell from './Cell';
import React, {  useEffect, useState} from 'react';
import styled from 'styled-components';
import breadthFirstSearch from '../services/breadthFirstSearch';

import {MatrixKey,Matrix,MatrixRow} from '../interfaces/Board.interface';
import {Node} from '../interfaces/Cell.interface';

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

    const markCellAsWall = (row:number, col:number) => {
        updateMatrixNode(row, col,'isWall');
    };

    const getPathToFinishNode = () => {
        breadthFirstSearch(matrix,startNode,finishNode,updateMatrixNode);
    };

    const updateMatrixNode = (targetRow:number, targetCol:number,properyKey:MatrixKey ) => {
        setMatrix((m)=>{
            
        const newMatrix :Matrix = [...m];
        const newTargetRow :MatrixRow= [...newMatrix[targetRow]];

        const currentIsVisitedValue = newTargetRow[targetCol][`${properyKey}`];
        newTargetRow[targetCol]={...newTargetRow[targetCol],[`${properyKey}`]:!currentIsVisitedValue};

        newMatrix[targetRow] = newTargetRow;

        console.log(newMatrix);

        return newMatrix;
        });
};

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
                    isPartOfThePath:false,
                    row: row,
                    col: col,
                    type: isStartNode
                        ? 'start'
                        : isFinishNode
                            ? 'finish'
                            : undefined
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
            {matrix.map((row) => (
                row.map((node) => (
                    <Cell
                        isVisited={node.isVisited}
                        isWall={node.isWall}
                        isPartOfThePath={node.isPartOfThePath}
                        row={node.row}
                        col={node.col}
                        type={node.type}
                        handleClick={markCellAsWall}
                    ></Cell>
                ))
            ))}
        </BoardWrapper>
    </React.Fragment>
    );
}

export default Board;
