export interface Props {
    size: number
};

export interface ComeFromData {
        parent: string | undefined,
        value: number,
}

export interface ComeFrom {
    [name: string]: ComeFromData
}
