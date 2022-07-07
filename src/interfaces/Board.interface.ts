export interface Props {
    size: number,
    algorithmFunc:Function,
};

export interface ComeFromData {
        parent: string | undefined,
        value: number,
}

export interface ComeFrom {
    [name: string]: ComeFromData
}
