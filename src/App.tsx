import Board from './components/Board'
import './App.css';
import React, { useEffect, useRef, useState } from 'react';
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
  const INITIAL_SIZE = 15;

  const [boardSize, setBoardSize] = useState<number>(INITIAL_SIZE);


  const handleSliderUpdate = (sliderValue: number) => {
    const minSize = 10;
    const maxSize = 50;
    const ratio = maxSize - minSize;
    const newSize = minSize + Math.ceil(ratio * sliderValue / 100);

    setBoardSize(newSize);
  }

  return (
    <React.Fragment>
      {/* <input  key='rows-input' name='rows-input' onChange={(e) => setBoardSize(e)} defaultValue={INITIAL_SIZE} type="number" />
      <input  key='cols-input'  name='cols-input' onChange={(e) => setBoardSize(e)} defaultValue={INITIAL_SIZE} type="number" /> */}
      <RangeSlider boardSize={boardSize} updateBoardSize={handleSliderUpdate} />
      <BoardContainer>
        {/* <Board size={boardSize} algorithmFunc={breadthFirstSearch} ></Board> */}
        <Board size={boardSize} algorithmFunc={greedyBestFirstSearch} ></Board>
      </BoardContainer>
    </React.Fragment>
  );
}

export default App;
