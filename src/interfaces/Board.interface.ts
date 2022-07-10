export interface Props {
    algorithmFunc: Function,
    delayFunc: Function,
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
