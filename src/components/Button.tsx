import React from 'react'
import styled from 'styled-components';
import { BackgroundColorType, ButtonType, Icon } from '../global';
import { ButtonProps } from '../interfaces/Button.interface';

export const ButtonWrapper = styled.button`
  position:relative;

  background: ${(props: { buttonType: ButtonType }) => {
    switch (props.buttonType) {
      case ButtonType.Start:
        return `url(${Icon.Start}) ${BackgroundColorType.LightBlue}`;
      case ButtonType.Pause:
        return `url(${Icon.Pause}) ${BackgroundColorType.LightGray}`;
      case ButtonType.Next:
        return `url(${Icon.Next}) ${BackgroundColorType.Red}`;
      case ButtonType.Previous:
        return `url(${Icon.Previous}) ${BackgroundColorType.Green}`;
      case ButtonType.Reset:
        return `url(${Icon.Reset}) ${BackgroundColorType.White}`;
      default:
        return `${BackgroundColorType.White}`;
    };
  }};
  background-size:contain;
  background-repeat:no-repeat;
  background-position:center;
  flex-grow:1;
  border:none;
  height:50px;
  font-size:1.2rem;
  font-weight:bold;
  text-transform:uppercase;
  border-radius:10px;
  cursor: pointer;

  :hover{
    box-shadow: 1px 3px ${BackgroundColorType.LightGray};
    transform: translate(-3px,-1px) scale(1.02);
  }
`;




function Button({ buttonType, handleClickFunc, children }: ButtonProps) {
  return (
    <ButtonWrapper buttonType={buttonType} onClick={() => handleClickFunc()}>
      {children}
    </ButtonWrapper>
  );
};

export default Button