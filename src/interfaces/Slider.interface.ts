export enum SliderType { rowsSlider, colsSlider, delaySlider, progressSlider };

export interface ISlider {
    icon: string,
    label:string,
    defaultValue?: number,
    value?: number,
    sliderType?: SliderType,
    disabled:boolean,
    updateBoardSizeFunc: Function,
}