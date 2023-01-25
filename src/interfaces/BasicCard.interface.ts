import { TextColorType } from '../global';

export interface CardLabel{
  short:string,
  long:string
}

export interface BasicCardProps {
  label: CardLabel,
  data: string | number,
  textColor: TextColorType
}
