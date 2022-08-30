export enum SliderType { rowsSlider, colsSlider, speedSlider, progressSlider };

export interface ISlider {
    icon: string,
    defaultValue: number,
    sliderType: SliderType,
    updateBoardSizeFunc: Function,
}