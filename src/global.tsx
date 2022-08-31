import { css } from 'styled-components'

export const NodeBase = css`
flex-basis:100%;
position:relative;
cursor:pointer;
border-radius:2px;
`;

export const NodeText = css`
display: flex;
justify-content: center;
align-items:center;
color:black;
font-size:2vmin;

@media screen and (max-width: 650px) {
 font-size:3vmin;
}
`;

export const ButtonTypes = {
    Start: 'startButton',
    Pause: 'pauseButton',
    Reset: 'resetButton',
    Next: 'nextButton',
    Previous: 'previousButton',
}

export const getMatrixInitValue = (rows: number, cols: number, isNumeric = false) => {
    let initMatrix: boolean[][] | number[][] = Array(rows);

    for (let row = 0; row < rows; row++) {
        initMatrix[row] = Array(cols);
        for (let col = 0; col < cols; col++) {
            initMatrix[row][col] = isNumeric ? 0 : false;
        }
    }

    return initMatrix
};



export const updateMatrixRows = (newSize: number, currentSize: number, matrix: boolean[][] | number[][], initialValue: boolean | number) => {
    if (newSize == currentSize) {
        return matrix;
    }

    const isGrowth = newSize > currentSize;
    if (isGrowth) {
        for (let row = currentSize; row < newSize; row++) {
            const colsCount = matrix[0].length;
            matrix[row] = Array(colsCount);
            for (let col = 0; col < colsCount; col++) {
                matrix[row][col] = initialValue;
            }
        }
    } else {
        matrix.length = newSize;
    }

    return matrix;
};

export const updateMatrixCols = (newSize: number, currentSize: number, matrix: boolean[][] | number[][], initialValue: boolean | number) => {
    if (newSize == currentSize) {
        return matrix;
    }

    const isGrowth = newSize > currentSize;
    const rowsCount = matrix.length;
    if (isGrowth) {
        for (let row = 0; row < rowsCount; row++) {
            for (let col = currentSize; col < newSize; col++) {
                matrix[row][col] = initialValue;
            }
        }
    } else {
        matrix.map(row => row.length = newSize);
    }

    return matrix;
};

export const splitNodePosition = (currentKey: string) => {
    let currentKeyData = currentKey.split('-');
    let row = parseInt(currentKeyData[0]);
    let col = parseInt(currentKeyData[1]);
    return { row, col };
}

export const matrixDeepCopy = (matrix: boolean[][] | number[][]) => {
    return JSON.parse(JSON.stringify(matrix));
}