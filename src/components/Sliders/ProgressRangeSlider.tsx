import React from 'react';
import RangeSlider from './RangeSlider';
import { BoardData } from '../../interfaces/Context.interface';
import { SliderType } from '../../interfaces/Slider.interface';
import { useBoardContext, ActionTypes as ContextActionTypes, useBoardUpdateContext  } from '../BoardContext';

const INITIAL_ITERATION = 0;

function ProgressRangeSlider({  icon, label }: any) {
	const boardContext = useBoardContext();
    const boardUpdateContext = useBoardUpdateContext();

	let largestBoardValues = Object.values<BoardData>(boardContext.boards).reduce((largestBoard, currentBoard) => largestBoard.iterationsCount! > currentBoard.iterationsCount! ? largestBoard : currentBoard);
	let currentValue = largestBoardValues.currentIteration ? 100 / (largestBoardValues.iterationsCount! / largestBoardValues.currentIteration) : 0;

	const updateProgressBar = (sliderValue: number): void =>{
		const maxIterationsCount = Math.max(...Object.values(boardContext.boards).map((board: any) => board.iterationsCount));
		const targetIteration = Math.ceil(maxIterationsCount * sliderValue / 100);
	
		Object.keys(boardContext.boards).forEach((algorithmKey: any) => {
			boardUpdateContext.dispatch({ type: ContextActionTypes.JUMP_AT_INDEX, payload: { algorithmKey, targetIteration } })
		})
	}
	
	return (boardContext.isInExecution && Object.keys(boardContext.boards).length 
		?<RangeSlider icon={icon} label={label} value={currentValue} sliderType={SliderType.progressSlider} updateBoardSizeFunc={updateProgressBar} disabled={false} />
		:null
		);
};

export default ProgressRangeSlider;