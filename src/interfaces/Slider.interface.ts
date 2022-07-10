export enum SliderType { rowsSlider, colsSlider, speedSlider };

export interface ISlider {
    boardSize: number,
    sliderType: SliderType,
    updateBoardSizeFunc: Function,
}