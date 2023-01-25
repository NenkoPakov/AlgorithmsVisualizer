import { css } from 'styled-components';
import breadthFirstSearch from './algorithms/breadthFirstSearch';
import greedyBestFirstSearch from './algorithms/greedyBestFirstSearch';
import PreviousIcon from './wwwroot/svg/prev.svg';
import NextIcon from './wwwroot/svg/next.svg';
import StartIcon from './wwwroot/svg/start.svg';
import PauseIcon from './wwwroot/svg/pause.svg';
import ResetIcon from './wwwroot/svg/reset.svg';
import ArrowsColIcon from './wwwroot/svg/arrow-ew.svg';
import ArrowsRowIcon from './wwwroot/svg/arrow-ns.svg';
import DelayIcon from './wwwroot/svg/delay.svg';
import ProgressIcon from './wwwroot/svg/progress.svg';

export const NodeBase = css`
/* flex-basis:100%; */
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

export const Algorithm = {
    'BFS': breadthFirstSearch,
    'Greedy Best FS': greedyBestFirstSearch,
    'TEST1': breadthFirstSearch,
    'TEST2': greedyBestFirstSearch,
}

export const CardLabels = {
    row: {
        short:'Rows',
        long:'Rows Count'
    },
    col: {
        short:'Cols',
        long:'Cols Count'
    },
    wall: {
        short:'Walls',
        long:'Walls Count'
    },
    delay: {
        short:'Delay',
        long:'Delay Type'
    },
    status: {
        short:'Status',
        long:'Status'
    },
    path: {
        short:'Path',
        long:'Found Path'
    },
    progress: {
        short:'Progress',
        long:'Progress'
    },
};

export enum ButtonType {
    Start = 'startButton',
    Pause = 'pauseButton',
    Reset = 'resetButton',
    Next = 'nextButton',
    Previous = 'previousButton',
    Default = 'defaultButton',
}

export enum TextColorType {
    Green = '#8cbf5b',
    DarkGray = '#464646',
    Red = '#e36161',
    Gray = '#c5c5c5',
    White = '#fff',
}

export const Icon = {
    Start: StartIcon,
    Pause: PauseIcon,
    Reset: ResetIcon,
    Next: NextIcon,
    Previous: PreviousIcon,
    ArrowsCol: ArrowsColIcon,
    ArrowsRow: ArrowsRowIcon,
    Delay: DelayIcon,
    Progress: ProgressIcon,
};

export const BackgroundColorType = {
    Purple: '#645df7',
    TransparentWhite: '#ffffff2f',
    White: '#fff',
    SmokedWhite:'#ececec',
    Gray: '#c5c5c5',
    LightGray: '#ddd',
    LightBlue: '#99DDFF',
    Blue: '#95b9f4',
    Red: '#e36161',
    Green: '#8cbf5b',
    Gold: '#c7b66efc',
    Brown: '#786b78',
    Beige: '#817c66fc',
    TransparentBlack: '#00000023',
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

export const parseNodeData = (currentKey: string) => {
    const [row, col] = currentKey.split('-').map(value => parseInt(value));
    return { row, col };
}

export const matrixDeepCopy = (matrix: boolean[][] | number[][]) => {
    return JSON.parse(JSON.stringify(matrix));
}