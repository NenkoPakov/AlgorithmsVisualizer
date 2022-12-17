import React from 'react'
import styled from 'styled-components';
import { Algorithm, BackgroundColorType, ButtonType } from '../global';
import { useBoardContext, useBoardUpdateContext, ActionTypes as ContextActionTypes } from './BoardContext';
import { DropdownProps } from '../interfaces/Dropdown.interface';
import { ButtonWrapper } from './Button';

const DropdownButton = styled(ButtonWrapper)`
  border-bottom-left-radius:${(props: { isDropdownOpened: boolean }) => props.isDropdownOpened ? 'unset' : 'inherits'}; 
  border-bottom-right-radius:${(props: { isDropdownOpened: boolean }) => props.isDropdownOpened ? 'unset' : 'inherits'}; 
  width: 100%;
`;

const DropdownContainer = styled.div`
  width: 100%;
  position: relative;
  display: inline-block;

  ul {
    display:${(props: { isDropdownOpened: boolean }) => props.isDropdownOpened ? 'block' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 2;
    background-color:${BackgroundColorType.Gray};
    border-radius:0 0 10px 10px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 8px 12px;
  }

  li:hover {
    background-color: ${BackgroundColorType.TransparentBlack};
    cursor: pointer;
  }
`;

function Dropdown({ isDropdownOpened, handleDropdownClick }: DropdownProps) {

  const boardContext = useBoardContext();
  const boardUpdateContext = useBoardUpdateContext();

  return (
    <DropdownContainer isDropdownOpened={isDropdownOpened}>
      <DropdownButton isDropdownOpened={isDropdownOpened} buttonType={ButtonType.Default} onClick={() => handleDropdownClick(!isDropdownOpened)}>
        <label>ALGORITHMS</label>
      </DropdownButton>
      <ul>
        {
          Object.keys(Algorithm).map((algorithm: string) =>
            <li key={`dropdown-item-${algorithm}`} onClick={() => { boardUpdateContext.dispatch({ type: boardContext.boards.hasOwnProperty(algorithm) ? ContextActionTypes.REMOVE_BOARD : ContextActionTypes.ADD_BOARD, payload: algorithm }) }}>
              <input type="checkbox" value={algorithm} defaultChecked={boardContext.boards.hasOwnProperty(algorithm)} />
              {algorithm}
            </li>)
        }
      </ul>
    </DropdownContainer>
  );
};

export default Dropdown;