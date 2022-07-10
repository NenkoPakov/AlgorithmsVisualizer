import Board from './components/Board'
import './App.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import RangeSlider from './components/RangeSlider';
import breadthFirstSearch from './services/breadthFirstSearch';
import greedyBestFirstSearch from './services/greedyBestFirstSearch';
import styled from 'styled-components';
import BoardProvider, { useBoard, useBoardUpdate } from './components/BoardContext';
import { SliderType } from './interfaces/Slider.interface';

const BoardContainer = styled.section`
  width:90vw;
  height:90vh;
  display:flex;
  flex-direction:row;
  justify-content:space-around;
  `;





function App() {
  const MIN_SIZE = 15;
  const MAX_SIZE = 45;
  const SIZE_RATIO = MAX_SIZE - MIN_SIZE;
  const INITIAL_SIZE = 15;
  const INITIAL_TIMEOUT_MILLISECONDS = 80;

  const [boardRows, setBoardRows] = useState<number>(INITIAL_SIZE);
  const [boardCols, setBoardCols] = useState<number>(INITIAL_SIZE);

  const speed = useRef<number>(INITIAL_TIMEOUT_MILLISECONDS);
  // const isInExecution = useRef<boolean>(false);

  const { isDrawingWall, isUnmarkAction, isInExecution } = useBoard();
  const { handleWallDrawingEvent, handleUnmarkEvent, handleExecution } = useBoardUpdate();

  const handleSliderUpdate = useCallback((sliderValue: number, sliderType: SliderType) => {
    const newSize = MIN_SIZE + Math.ceil(SIZE_RATIO * sliderValue / 100);

    switch (sliderType) {
      case SliderType.rowsSlider:
        setBoardRows(newSize);
        break;
      case SliderType.colsSlider:
        setBoardCols(newSize);
        break;
      case SliderType.speedSlider:
        speed.current = sliderValue * 2;
        break;
      default:
        //throw exception
        break;
    }
  }, [])

  // const handleExecution = useCallback(() => {
  //   isInExecution.current = !isInExecution.current;
  // }, [])

  const delayFunc = useCallback(async () => {
    return new Promise(resolve => setTimeout(resolve, speed.current));
  }, [speed])

  return (
    <React.Fragment>
      {/* <input  key='rows-input' name='rows-input' onChange={(e) => setBoardSize(e)} defaultValue={INITIAL_SIZE} type="number" />
      <input  key='cols-input'  name='cols-input' onChange={(e) => setBoardSize(e)} defaultValue={INITIAL_SIZE} type="number" /> */}
      <BoardProvider>
        <RangeSlider key='range-slider-rows' boardSize={boardRows} sliderType={SliderType.rowsSlider} updateBoardSizeFunc={handleSliderUpdate} />
        <RangeSlider key='range-slider-cols' boardSize={boardCols} sliderType={SliderType.colsSlider} updateBoardSizeFunc={handleSliderUpdate} />
        <RangeSlider key='range-slider-speed' boardSize={speed.current} sliderType={SliderType.speedSlider} updateBoardSizeFunc={handleSliderUpdate} />
        <BoardContainer>
          {/* <Board boardRows={boardRows} boardCols={boardCols} speed={speed} algorithmFunc={breadthFirstSearch} ></Board> */}
          <Board boardRows={boardRows} boardCols={boardCols} algorithmFunc={greedyBestFirstSearch} delayFunc={delayFunc} ></Board>
        </BoardContainer>
      </BoardProvider>
    </React.Fragment>
  );
}

export default App;
