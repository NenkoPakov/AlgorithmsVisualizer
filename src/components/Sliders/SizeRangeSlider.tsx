import React from 'react';
import RangeSlider from './RangeSlider';
import { BoardData } from '../../interfaces/Context.interface';
import { SliderType } from '../../interfaces/Slider.interface';
import { ActionTypes } from '../BoardManager';

const INITIAL_SIZE_SLIDER_DEFAULT_VALUE = 0;
const MIN_SIZE = 15;
const MAX_SIZE = 30;
const SIZE_RATIO = MAX_SIZE - MIN_SIZE;

function SizeRangeSlider({  icon, label, boardManagerDispatch, sliderType  }: any) {
	
	const updateSize = (sliderValue: number): void =>{
        const newSize = MIN_SIZE + Math.ceil(SIZE_RATIO * sliderValue / 100);

		switch (sliderType) {
			case SliderType.rowsSlider:
                boardManagerDispatch({ type: ActionTypes.SET_BOARD_ROWS, payload: newSize })
                break;
                
            case SliderType.colsSlider:
                boardManagerDispatch({ type: ActionTypes.SET_BOARD_COLS, payload: newSize })
                break;
		}
	}

	return (
		<RangeSlider icon={icon} label={label} defaultValue={INITIAL_SIZE_SLIDER_DEFAULT_VALUE} sliderType={sliderType} updateBoardSizeFunc={updateSize} disabled={false} />
	);
};

export default SizeRangeSlider;