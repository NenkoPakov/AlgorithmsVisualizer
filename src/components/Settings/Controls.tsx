import React, { useRef, useState } from 'react'
import styled from 'styled-components';
import { Icon } from '../../global';
import { SliderType } from '../../interfaces/Slider.interface';
import Dropdown from './Dropdown';
import DelayRangeSlider from '../Sliders/DelayRangeSlider';
import ProgressRangeSlider from '../Sliders/ProgressRangeSlider';
import SizeRangeSlider from '../Sliders/SizeRangeSlider';
import { useBoardContext } from '../BoardContext';

const ControlsWrapper = styled.section`
  position:absolute;
  width:100%;
  top:50%;
  transform: translate(0, -50%);
`;

function Controls({isDropdownOpened,setIsDropdownOpened, boardManagerDispatch, delayState,delayRef,getDelayTypeFunc }: any) {
    
	const boardContext = useBoardContext();

    return (
        <ControlsWrapper>
            <SizeRangeSlider 
            key='range-slider-rows' 
            icon={Icon.ArrowsRow} 
            label='row' 
            boardManagerDispatch={boardManagerDispatch} 
            sliderType={SliderType.rowsSlider} 
            disabled={true}
            />
            <SizeRangeSlider 
            key='range-slider-cols' 
            icon={Icon.ArrowsCol} 
            label='col' 
            boardManagerDispatch={boardManagerDispatch} 
            sliderType={SliderType.colsSlider} 
            disabled={true}
            />
            <DelayRangeSlider 
            key='range-slider-speed' 
            icon={Icon.Delay} 
            label='delay' 
            boardManagerDispatch={boardManagerDispatch} 
            delayRef={delayRef} 
            delayState={delayState}
            getDelayTypeFunc={getDelayTypeFunc}
            disabled={false}
            />
           {Object.keys(boardContext.boards).length >0  && <ProgressRangeSlider 
            key='range-slider-progress' 
            icon={Icon.Progress} 
            label='progress'
            />} 
            <Dropdown isDropdownOpened={isDropdownOpened} handleDropdownClick={setIsDropdownOpened} />
        </ControlsWrapper>
    )
}

export default Controls