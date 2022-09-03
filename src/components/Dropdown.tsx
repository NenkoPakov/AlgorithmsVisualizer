import React from 'react'
import styled from 'styled-components';
import { Algorithm } from '../global';
import { useBoardContext, useBoardUpdateContext, ActionTypes as ContextActionTypes } from './BoardContext';
import { DropdownProps } from '../interfaces/Dropdown.interface';

const DropdownContainer = styled.div<any>`
  width: 100%;
  position: relative;
  display: inline-block;

  button {
    border: solid black 2px;
    border-radius:10px;
    padding: 10px 0;
    width: 100%;
    border: 0;
    background-color: #ffffff;
    color: #333;
    cursor: pointer;
    outline: 0;

    label{
        font-size: 20px;
        font-weight:550;
    }
  }

  ul {
    display:${(props: {isDropdownOpened:boolean}) => props.isDropdownOpened ? 'block' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 2;
    border: 1px solid rgba(0, 0, 0, 0.04);
    box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14);

    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 8px 12px;
  }

  li:hover {
    background-color: rgba(0, 0, 0, 0.14);
    cursor: pointer;
  }
  `;

function Dropdown({ isDropdownOpened, handleDropdownClick }: DropdownProps) {

    const boardContext = useBoardContext();
    const boardUpdateContext = useBoardUpdateContext();

    return (
        <DropdownContainer isDropdownOpened={isDropdownOpened}>
            <button type="button" onClick={() => handleDropdownClick(!isDropdownOpened)}>
                <label>ALGORITHMS</label>
                {/* {Object.keys(boardContext.boards).map(algorithm => <div>{algorithm}</div>)} */}
            </button>
            <ul>
                {
                    Object.keys(Algorithm).map((algorithm: string) =>
                        <li onClick={() => { boardUpdateContext.dispatch({ type: boardContext.boards.hasOwnProperty(algorithm) ? ContextActionTypes.REMOVE_BOARD : ContextActionTypes.ADD_BOARD, payload: algorithm }) }}>
                            <input type="checkbox" value={algorithm} checked={boardContext.boards.hasOwnProperty(algorithm)} />
                            {algorithm}
                        </li>)
                }
            </ul>
        </DropdownContainer>
    )
}

export default Dropdown