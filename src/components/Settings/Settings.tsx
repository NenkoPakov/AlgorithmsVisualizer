import React, { useState } from 'react'
import styled from 'styled-components';
import { TextColorType } from '../../global';
import Actions from './Actions';
import Controls from './Controls';

const SettingsContainer = styled.div`
  position:relative;
  display:flex;
  flex-direction:column;
  padding-bottom:35px;
  width:20vw;
  margin:20px;
  height:100%;

    @media (max-width: 600px){
      display:none;

      /* transform:translateX(-100%); */
    }
`;

const Title = styled.h1`
  position:absolute;
  width:100%;
  color:${TextColorType.White};
  text-align:center;
  top:0;
`;

function Settings({ boardManagerDispatch, delayState, delayRef, getDelayTypeFunc }: any) {
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);

  return (
    <SettingsContainer
      onClick={(e: any) => {
        if (e.target.textContent != 'ALGORITHMS') setIsDropdownOpened(false)
      }}>
      <Title>Settings</Title>
      <Controls isDropdownOpened={isDropdownOpened} setIsDropdownOpened={setIsDropdownOpened} boardManagerDispatch={boardManagerDispatch} delayState={delayState} delayRef={delayRef} getDelayTypeFunc={getDelayTypeFunc} />
      <Actions />
    </SettingsContainer>
  );
};

export default Settings;