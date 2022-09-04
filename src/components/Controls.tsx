import React, { useRef, useState } from 'react'
import styled from 'styled-components';
import { Icon } from '../global';
import { SliderType } from '../interfaces/Slider.interface';
import { useBoardContext, useBoardUpdateContext, ActionTypes as ContextActionTypes } from './BoardContext';
import { ActionTypes } from './BoardManager';
import Dropdown from './Dropdown';
import RangeSlider from './RangeSlider';

const SPEED_MULTIPLIER = 2;
const MIN_SIZE = 15;
const MAX_SIZE = 30;
const SIZE_RATIO = MAX_SIZE - MIN_SIZE;
const INITIAL_SIZE_SLIDER_DEFAULT_VALUE = 0;
const INITIAL_ITERATION = 0;

const ControlsWrapper = styled.section`
  position:relative;
  width:100%;
`;

function Controls({ boardManagerDispatch, delayState,delayRef,getDelayTypeFunc }: any) {
    const [isDropdownOpened, setIsDropdownOpened] = useState(false);
    const lastIterationIndex = useRef<number>(INITIAL_ITERATION);

    const boardContext = useBoardContext();
    const boardUpdateContext = useBoardUpdateContext();

    const handleSliderUpdate = (sliderValue: number, sliderType: SliderType): void => {
        const newSize = MIN_SIZE + Math.ceil(SIZE_RATIO * sliderValue / 100);

        switch (sliderType) {
            case SliderType.rowsSlider:
                boardManagerDispatch({ type: ActionTypes.SET_BOARD_ROWS, payload: newSize })
                break;
            case SliderType.colsSlider:
                boardManagerDispatch({ type: ActionTypes.SET_BOARD_COLS, payload: newSize })
                break;
            case SliderType.speedSlider:
                delayRef.current = sliderValue * SPEED_MULTIPLIER;

                let delayType = getDelayTypeFunc(sliderValue);
                if (delayState != delayType) {
                    boardManagerDispatch({ type: ActionTypes.SET_DELAY, payload: delayType });
                }
                break;
            case SliderType.progressSlider:
                const maxIterationsCount = Math.max(...Object.values(boardContext.boards).map((board: any) => board.iterationsCount));
                const targetIteration = Math.ceil(maxIterationsCount * sliderValue / 100);

                Object.keys(boardContext.boards).forEach((algorithmKey: any) => {
                    boardUpdateContext.dispatch({ type: ContextActionTypes.JUMP_AT_INDEX, payload: { algorithmKey, targetIteration } })
                })

                lastIterationIndex.current = targetIteration;

                break;

            default:
                //throw exception
                break;
        }

    };

    return (
        <ControlsWrapper>
            <RangeSlider key='range-slider-rows' icon={Icon.ArrowsRow} label='row' defaultValue={INITIAL_SIZE_SLIDER_DEFAULT_VALUE} sliderType={SliderType.rowsSlider} updateBoardSizeFunc={handleSliderUpdate} />
            <RangeSlider key='range-slider-cols' icon={Icon.ArrowsCol} label='col' defaultValue={INITIAL_SIZE_SLIDER_DEFAULT_VALUE} sliderType={SliderType.colsSlider} updateBoardSizeFunc={handleSliderUpdate} />
            <RangeSlider key='range-slider-speed' icon={Icon.Delay} label='delay' defaultValue={delayRef.current} sliderType={SliderType.speedSlider} updateBoardSizeFunc={handleSliderUpdate} />
            {boardContext.isInExecution && <RangeSlider key='range-slider-progress' icon={Icon.Progress} label='progress' defaultValue={INITIAL_ITERATION} sliderType={SliderType.progressSlider} updateBoardSizeFunc={handleSliderUpdate} />}
            <Dropdown isDropdownOpened={isDropdownOpened} handleDropdownClick={setIsDropdownOpened}></Dropdown>
        </ControlsWrapper>

    )
}

export default Controls