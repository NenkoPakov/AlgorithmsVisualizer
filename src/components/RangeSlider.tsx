import React from 'react';
import styled from 'styled-components'
import { BackgroundColorType, TextColorType } from '../global';
import { BoardData } from '../interfaces/Context.interface';
import { SliderType, ISlider } from '../interfaces/Slider.interface';
import { useBoardContext } from './BoardContext';

const SliderContainer = styled.div`
	margin-bottom:20px;
`;

const Slider = styled.input`
	position:relative;
	outline: 0;
	border: 0;
	min-width:200px;
	border-radius: 500px;
	width: 100%;
	transition: box-shadow 0.2s ease-in-out;	
	// Chrome
	@media screen and (-webkit-min-device-pixel-ratio:0) {
		& {
			overflow: hidden;
			height: 35px;
			-webkit-appearance: none;
			background-color: ${BackgroundColorType.White};
		}
		&::-webkit-slider-runnable-track {
			height: 35px;
			-webkit-appearance: none;
			transition: box-shadow 0.2s ease-in-out;
		}
		&::-webkit-slider-thumb {
			width: 35px;
			-webkit-appearance: none;
			height: 35px;
			cursor:${(props: { sliderType: SliderType }) => props.sliderType == SliderType.rowsSlider ? 'ns-resize' : 'ew-resize'};
			background:  ${BackgroundColorType.White};
			border:solid 3px black; 
			box-shadow: -340px 0 0 320px  ${BackgroundColorType.LightBlue}, inset 0 0 0 35px ${BackgroundColorType.LightBlue};
			border-radius: 50%;
			transition: box-shadow 0.2s ease-in-out;
			position: relative;
		}
		&:active::-webkit-slider-thumb {
			background:  ${BackgroundColorType.White};
			box-shadow: -340px 0 0 320px ${BackgroundColorType.LightBlue}, inset 0 0 0 3px ${BackgroundColorType.LightBlue};
		}
	}
	
	// Firefox
	&::-moz-range-progress {
		background-color: ${BackgroundColorType.LightBlue};
	}
	&::-moz-range-track {  
		background-color: ${BackgroundColorType.LightGray};
	}
	// IE
	&::-ms-fill-lower {
		background-color: ${BackgroundColorType.LightBlue};
	}
	&::-ms-fill-upper {  
		background-color: ${BackgroundColorType.LightGray};
	}
`;

const SliderInfo = styled.div`
	display:flex;
	flex-direction:row;
	gap:10px;
	align-items:center;
`;

const Icon = styled.img`
	height: 30px;
`;

const Label = styled.h3`
	margin:0;
	font-weight:500;
	text-transform:capitalize;
	color:${TextColorType.White};
`;

function RangeSlider({ icon, label, defaultValue, sliderType, updateBoardSizeFunc }: ISlider) {
	const boardContext = useBoardContext();

	const isDisabled = [SliderType.speedSlider, SliderType.progressSlider].includes(sliderType) ? false : boardContext.isInExecution;

	let largestBoardValues = Object.values<BoardData>(boardContext.boards).reduce((largestBoard, currentBoard) => largestBoard.iterationsCount! > currentBoard.iterationsCount! ? largestBoard : currentBoard);

	let currentValue;
	if (sliderType == SliderType.progressSlider) {
		currentValue = largestBoardValues.currentIteration ? 100 / (largestBoardValues.iterationsCount! / largestBoardValues.currentIteration) : 0;
	}

	return (
		<SliderContainer>
			<SliderInfo>
				<Icon src={icon} />
				<Label> {label} </Label>
			</SliderInfo>
			<Slider sliderType={sliderType} type="range" onChange={(e: any) => updateBoardSizeFunc((parseInt(e.target.value)), sliderType)} defaultValue={defaultValue} value={currentValue} disabled={isDisabled} />
		</SliderContainer>
	);
};

export default RangeSlider;