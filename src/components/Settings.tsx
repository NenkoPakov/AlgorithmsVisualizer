import React from 'react'
import styled from 'styled-components';

const SettingsContainer = styled.div`
position:relative;
display:flex;
justify-content:space-between;
flex-direction:column;
width:350px;
min-height:100%;
background-color:white ;
border:solid 5px gray;
border-radius:35px ;
padding:35px;
`;

function Settings({children}:any) {
  return (
    <SettingsContainer>
        Settings
        {children}
    </SettingsContainer>
  )
}

export default Settings