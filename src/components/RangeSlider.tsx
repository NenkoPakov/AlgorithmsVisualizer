import React from 'react';
import styled from 'styled-components'
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
		/* margin-bottom:50px; */
		border-radius: 500px;
		width: 100%;
		transition: box-shadow 0.2s ease-in-out;

		// Chrome
		@media screen and (-webkit-min-device-pixel-ratio:0) {
			& {
				overflow: hidden;
				height: 35px;
				-webkit-appearance: none;
				background-color: #ddd;
			}
			&::-webkit-slider-runnable-track {
				height: 35px;
				-webkit-appearance: none;
				color: #444;
				// margin-top: -1px;
				transition: box-shadow 0.2s ease-in-out;
			}
			&::-webkit-slider-thumb {
				width: 35px;
				-webkit-appearance: none;
				height: 35px;
				cursor:${(props: { sliderType: SliderType }) => props.sliderType == SliderType.rowsSlider ? 'ns-resize' : 'ew-resize'};
				background: #fff;
				border:solid 3px black; 
				box-shadow: -340px 0 0 320px #99DDFF, inset 0 0 0 35px #99DDFF;
				border-radius: 50%;
				transition: box-shadow 0.2s ease-in-out;
				position: relative;
				// top: 1px;
			}
			&:active::-webkit-slider-thumb {
				background: #fff;
				box-shadow: -340px 0 0 320px #99DDFF, inset 0 0 0 3px #99DDFF;
			}
		}
        
		// Firefox
		&::-moz-range-progress {
			background-color: #43e5f7; 
		}
		&::-moz-range-track {  
			background-color: #9a905d;
		}
		// IE
		&::-ms-fill-lower {
			background-color: #43e5f7; 
		}
		&::-ms-fill-upper {  
			background-color: #9a905d;
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
color:white;
`;

function RangeSlider({ icon, label, defaultValue, sliderType, updateBoardSizeFunc }: ISlider) {

	const boardContext = useBoardContext();

	const isDisabled = [SliderType.speedSlider, SliderType.progressSlider].includes(sliderType) ? false : boardContext.isInExecution;

	var boardsValues: BoardData[] = Object.values(boardContext.boards);
	let largestBoardValues = boardsValues.reduce((largestBoard, currentBoard) => largestBoard.iterationsCount! > currentBoard.iterationsCount! ? largestBoard : currentBoard);

	let currentValue;
	if (sliderType == SliderType.progressSlider) {
		currentValue = largestBoardValues.currentIteration ? 100 / (largestBoardValues.iterationsCount! / largestBoardValues.currentIteration) : 0;
	}

	return <SliderContainer>
		<SliderInfo>
			<Icon src={icon}></Icon>
			<Label> {label} </Label>
		</SliderInfo>
		<Slider sliderType={sliderType} type="range" onChange={(e: any) => updateBoardSizeFunc((parseInt(e.target.value)), sliderType)} defaultValue={defaultValue} value={currentValue} disabled={isDisabled} />
	</SliderContainer>
	{/* <SizeIndicatorContainer >
						<SizeIndicator>
							{58}
						</SizeIndicator>
				</SizeIndicatorContainer> */}


}

export default RangeSlider;