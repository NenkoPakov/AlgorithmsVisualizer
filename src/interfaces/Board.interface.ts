export interface BoardProps {
    algorithmFunc: Function,
    delayFunc: Function,
    // updateExecutionFunc: Function,
    boardRows: number,
    boardCols: number,
    // speed: number,
};

export interface ComeFromData {
    parent: string | undefined,
    value: number,
}

export interface ComeFrom {
    [name: string]: ComeFromData
}
