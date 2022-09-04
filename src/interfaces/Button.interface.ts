import { ButtonType } from "../global";

export interface ButtonProps {
    buttonType: ButtonType,
    handleClickFunc: Function,
    children?:React.ReactNode
  }