import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import styled from 'styled-components';

const CellWrapper = styled.div`
/* width:100px;
height:100px; */
position:relative;

border:1px solid black;
background-color:${(props) => (props.isMarked ? 'gray' : 'lightblue')};
transition: background-color 0.4s ease-out;

grid-row: ${(props) => props.row };
grid-column: ${(props) => props.col };

:hover{
background-color:${(props) => (props.isMarked ? 'lightblue':'gray')};
transition: background-color 0.9s ease-in;
}
`;

function Cell({row,col}) {
  const [isMarked, setIsMarked] = useState(false);
  const[isWall, setIsWall] = useState(false);
  
  const handleClick = () => {
    setIsMarked(!isMarked);
    console.log(`You clicked cell with id: ${row}-${col}.`);
  };


  return (
    <CellWrapper isMarked={isMarked} row={row} col={col} id={{row}-{col}} onClick={()=>handleClick()}></CellWrapper>
  );
}

export default Cell;