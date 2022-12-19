import React from 'react';
import RangeSlider from './RangeSlider';
import { SliderType } from '../../interfaces/Slider.interface';
import { ActionTypes } from '../BoardManager';

const SPEED_MULTIPLIER = 2;

function DelayRangeSlider({ icon, label, defaultValue, delayRef, delayState, getDelayTypeFunc, boardManagerDispatch }: any) {
	const updateProgressBar = (sliderValue: number): void => {
		delayRef.current = sliderValue * SPEED_MULTIPLIER;

		let delayType = getDelayTypeFunc(sliderValue);
		if (delayState != delayType) {
			boardManagerDispatch({ type: ActionTypes.SET_DELAY, payload: delayType });
		}
	}

	return (
		<RangeSlider icon={icon} label={label} defaultValue={defaultValue} sliderType={SliderType.progressSlider} updateBoardSizeFunc={updateProgressBar} disabled={false} />
	);
};

export default DelayRangeSlider;