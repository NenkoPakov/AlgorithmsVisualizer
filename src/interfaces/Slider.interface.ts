export enum SliderType { rowsSlider, colsSlider, speedSlider, progressSlider };

export interface ISlider {
    icon: string,
    label:string,
    defaultValue: number,
    sliderType: SliderType,
    updateBoardSizeFunc: Function,
}