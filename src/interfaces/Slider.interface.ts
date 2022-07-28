export enum SliderType { rowsSlider, colsSlider, speedSlider, progressSlider };

export interface ISlider {
    defaultValue: number,
    sliderType: SliderType,
    updateBoardSizeFunc: Function,
}