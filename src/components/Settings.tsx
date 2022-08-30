import React from 'react'
import styled from 'styled-components';

const SettingsContainer = styled.div`
position:relative;
display:flex;
justify-content:space-between;
flex-direction:column;
max-width:300px;
/* background-color:#c8d8e4; */
/* border:solid 5px gray; */
/* border-radius:35px ; */
padding:35px;
`;

const Title =styled.h1`
color:#fff;
text-align:center;
`;

function Settings({children}:any) {
  return (
    <SettingsContainer>
      <Title>Settings</Title>
        {children}
    </SettingsContainer>
  )
}

export default Settings