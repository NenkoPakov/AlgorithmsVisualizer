import Board from './components/Board'
import './App.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import RangeSlider from './components/RangeSlider';
import breadthFirstSearch from './services/breadthFirstSearch';
import greedyBestFirstSearch from './services/greedyBestFirstSearch';
import styled from 'styled-components';

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
  // const [speed, setSpeed] = useState<number>(INITIAL_TIMEOUT_MILLISECONDS);
  const speed = useRef<number>(INITIAL_TIMEOUT_MILLISECONDS);

  enum SliderType { rowsSlider, colsSlider, speedSlider };

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
        speed.current=sliderValue * 2;
        break;
      default:
        //throw exception
        break;
    }
  }, [])

  const delayFunc = useCallback(async () => {
    return new Promise(resolve => setTimeout(resolve, speed.current));
  },[speed])

  return (
    <React.Fragment>
      {/* <input  key='rows-input' name='rows-input' onChange={(e) => setBoardSize(e)} defaultValue={INITIAL_SIZE} type="number" />
      <input  key='cols-input'  name='cols-input' onChange={(e) => setBoardSize(e)} defaultValue={INITIAL_SIZE} type="number" /> */}
      <RangeSlider boardSize={boardRows} type={SliderType.rowsSlider} updateBoardSize={handleSliderUpdate} />
      <RangeSlider boardSize={boardCols} type={SliderType.colsSlider} updateBoardSize={handleSliderUpdate} />
      <RangeSlider boardSize={speed} type={SliderType.speedSlider} updateBoardSize={handleSliderUpdate} />
      <BoardContainer>
        {/* <Board boardRows={boardRows} boardCols={boardCols} speed={speed} algorithmFunc={breadthFirstSearch} ></Board> */}
        <Board boardRows={boardRows} boardCols={boardCols} algorithmFunc={greedyBestFirstSearch} delayFunc={delayFunc} ></Board>
      </BoardContainer>
    </React.Fragment>
  );
}

export default App;
