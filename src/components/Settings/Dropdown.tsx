import React from 'react'
import styled from 'styled-components';
import { Algorithm, BackgroundColorType, ButtonType } from '../../global';
import { useBoardContext, useBoardUpdateContext, ActionTypes as ContextActionTypes } from '../BoardContext';
import { DropdownProps } from '../../interfaces/Dropdown.interface';
import { ButtonWrapper } from '../Button';

const DropdownWrapper = styled.div`
  width: 100%;
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled(ButtonWrapper)`
  border-bottom-left-radius:${(props: { isDropdownOpened: boolean }) => props.isDropdownOpened ? 'unset' : 'inherits'}; 
  border-bottom-right-radius:${(props: { isDropdownOpened: boolean }) => props.isDropdownOpened ? 'unset' : 'inherits'}; 
  width: 100%;
`;

const DropdownItemsContainer = styled.ul`
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
`;

const DropdownItem = styled.li`
  padding: 8px 12px;

  :hover {
    background-color: ${BackgroundColorType.TransparentBlack};
    cursor: pointer;
  }
`;

function Dropdown({ isDropdownOpened, handleDropdownClick }: DropdownProps) {
  const boardContext = useBoardContext();
  const boardUpdateContext = useBoardUpdateContext();

  return (
    <DropdownWrapper onClick={()=>handleDropdownClick(!isDropdownOpened)}>
      <DropdownButton isDropdownOpened={isDropdownOpened} buttonType={ButtonType.Default}>
        <label>ALGORITHMS</label>
      </DropdownButton>
      <DropdownItemsContainer isDropdownOpened={isDropdownOpened}>
        {
          Object.keys(Algorithm).map((algorithm: string) =>
            <DropdownItem key={`dropdown-item-${algorithm}`} onClick={() => { boardUpdateContext.dispatch({ type: boardContext.boards.hasOwnProperty(algorithm) ? ContextActionTypes.REMOVE_BOARD : ContextActionTypes.ADD_BOARD, payload: algorithm }) }}>
              <input type="checkbox" value={algorithm}  checked={boardContext.boards.hasOwnProperty(algorithm)}/>
              {algorithm}
            </DropdownItem>)
        }
      </DropdownItemsContainer>
    </DropdownWrapper>
  );
};

export default Dropdown;