import React from 'react'
import styled from 'styled-components'
import { TextColorType } from '../global';
import { BasicCardProps } from '../interfaces/BasicCard.interface';
import Card from './Card';

const Title = styled.h4`
  margin:0;
  font-weight:400;
  text-transform:capitalize;
  color:${TextColorType.Gray};
`;

const Data = styled.h2`
  margin:0;
  text-transform:capitalize;
  color:${(props: { color: TextColorType }) => props.color};
`;

function BasicCard({ title, data, textColor }: BasicCardProps) {
  return (
    <Card>
      <Title>{title}</Title>
      <Data color={textColor}>{data}</Data>
    </Card>
  )
}

export default BasicCard