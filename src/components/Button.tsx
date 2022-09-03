import React from 'react'
import styled from 'styled-components';
import { ButtonType } from '../global';
import PreviousIcon from '../wwwroot/svg/prev.svg';
import NextIcon from '../wwwroot/svg/next.svg';
import StartIcon from '../wwwroot/svg/start.svg';
import PauseIcon from '../wwwroot/svg/pause.svg';
import ResetIcon from '../wwwroot/svg/reset.svg';

const ButtonWrapper = styled.button<any>`
position:relative;

  background: ${(props: any) => {
    switch (props.buttonType) {
      case ButtonType.Start:
        return `url(${StartIcon})`;
      case ButtonType.Pause:
        return `url(${PauseIcon})`;
      case ButtonType.Next:
        return `url(${NextIcon})`;
      case ButtonType.Previous:
        return `url(${PreviousIcon})`;
      case ButtonType.Reset:
        return `url(${ResetIcon})`;
      default:
        return '';
    };
  }};
  
  background-size:contain;
  background-repeat:no-repeat;
  background-position:center;
  background-color: ${(props: { buttonType: any }) => {
    switch (props.buttonType) {
      case ButtonType.Start:
        return '#99DDFF';
      case ButtonType.Pause:
        return '#ddd';
      case ButtonType.Next:
        return '#e36161';
      case ButtonType.Previous:
        return '#8cbf5b';
      case ButtonType.Reset:
        return '#ffffff';
      default:
        return '#ffffff'
    };
  }};
  flex-grow:1;
  border:none;
  border-radius:20px;
  height:50px;
  font-size:1.2rem;
  font-weight:bold;
  text-transform:uppercase;
  /* border:solid 5px  ${(props: { isForStart: boolean }) => props.isForStart ? '#99DDFF' : '#ff3434'}; */
  border-radius:10px;
  cursor: pointer;

  :hover{
  transform: translateY(-5px);
  background-color:${(props: { isForStart: boolean }) => props.isForStart ? '#99DDFF' : '#ff3434'};
  color:${(props: { isForStart: boolean }) => props.isForStart ? 'black' : 'white'};

  box-shadow: 5px 5px lightgray;
}
`;



function Button({ buttonType, isForStart, handleClickFunc }: any) {
  return (
    <ButtonWrapper buttonType={buttonType} onClick={() => handleClickFunc(isForStart)} isForStart={isForStart}></ButtonWrapper>
  )
}

export default Button