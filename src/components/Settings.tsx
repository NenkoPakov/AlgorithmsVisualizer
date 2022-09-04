import React from 'react'
import styled from 'styled-components';
import { TextColorType } from '../global';

const SettingsContainer = styled.div`
  position:relative;
  display:flex;
  justify-content:space-between;
  flex-direction:column;
  max-width:300px;
  padding:35px;
`;

const Title =styled.h1`
  color:${TextColorType.White};
  text-align:center;
`;

function Settings({children}:{children:React.ReactNode}) {
  return (
    <SettingsContainer>
      <Title>Settings</Title>
        {children}
    </SettingsContainer>
  );
};

export default Settings;