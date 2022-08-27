import React from 'react'
import styled from 'styled-components';

const ButtonWrapper = styled.button`
position:relative;
width:100%;
/* padding:10px; */
display:flex;
align-items:center;
justify-content:center;
background-color:${(props: { isForStart: boolean }) => props.isForStart ? '#3FD2C7' : 'white'};
color:${(props: { isForStart: boolean }) => props.isForStart ? 'black' : '#ff3434'};
font-size:1.2rem;
font-weight:bold;
text-transform:uppercase;
border:solid 5px  ${(props: { isForStart: boolean }) => props.isForStart ? '#3FD2C7' : '#ff3434'};
border-radius:10px;
cursor: pointer;

:hover{
transform: translateY(-5px);
background-color:${(props: { isForStart: boolean }) => props.isForStart ? '#3FD2C7' : '#ff3434'};
color:${(props: { isForStart: boolean }) => props.isForStart ? 'black' : 'white'};

box-shadow: 5px 5px lightgray;
}
`;

function Button({text, isForStart, handleClickFunc}:any) {
  return (
    <ButtonWrapper onClick={()=>handleClickFunc(isForStart)} isForStart={isForStart}>{text}</ButtonWrapper>
  )
}

export default Button