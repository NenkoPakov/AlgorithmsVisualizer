import React from 'react'
import styled from 'styled-components'
import { BackgroundColorType, TextColorType } from '../global';
import { BasicCardProps } from '../interfaces/BasicCard.interface';

const Card = styled.section`
    position:relative;
    display: flex;
    flex-direction:column;
    justify-content:center;
    background-color:${BackgroundColorType.White};
    padding:5px 20px 5px 20px;
    border-radius:20px;
`;

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