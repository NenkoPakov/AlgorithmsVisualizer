import Board from './components/Board'
import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import RangeSlider from './components/RangeSlider';

function App() {
  const INITIAL_SIZE = 15;

  const [boardSize, setBoardSize] = useState<number>(0);
  const [rows, setRows] = useState(INITIAL_SIZE);
  const [cols, setCols] = useState(INITIAL_SIZE);

  // const setBoardSize = (event: any) => {
  //   // If the user presses the "Enter" key on the keyboard
  //   // if (event.key === "Enter") 
  //   {

  //     // Cancel the default action, if needed
  //     // event.preventDefault();

  //     if (event.target.name == 'rows-input') {
  //       setRows(event.target.value);
  //       console.log("rows")
  //       console.log(event.target.value)
  //     } else {
  //       setCols(event.target.value);
  //       console.log("cols")
  //       console.log(event.target.value)
  //     }
  //   }
  // }

  useEffect(() => {
    setRows(INITIAL_SIZE + boardSize / 10);
    setCols(INITIAL_SIZE + boardSize / 10);
  }, [boardSize])

  return (
    //React could deal approximately fast with board 30 by 30 not larger
    <React.Fragment>
      {/* <input  key='rows-input' name='rows-input' onChange={(e) => setBoardSize(e)} defaultValue={INITIAL_SIZE} type="number" />
      <input  key='cols-input'  name='cols-input' onChange={(e) => setBoardSize(e)} defaultValue={INITIAL_SIZE} type="number" /> */}
      <RangeSlider boardSize={boardSize} updateBoardSize={setBoardSize} />
      <Board size={INITIAL_SIZE} ></Board>
    </React.Fragment>
  );
}

export default App;
