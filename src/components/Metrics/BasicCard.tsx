import React from 'react'
import styled from 'styled-components'
import { BackgroundColorType, TextColorType } from '../../global';
import { BasicCardProps, CardLabel } from '../../interfaces/BasicCard.interface';

const Card = styled.section`
    position:relative;
    display: flex;
    flex-direction:column;
    justify-content:center;
    background-color:${BackgroundColorType.White};
    padding:5px 20px 5px 20px;
    border-radius:20px;

    @media (max-width: 600px){
      padding:2.5px 10px 2.5px 10px;
      border-radius:10px;
    }
`;

const Title = styled.h4<any>`
  margin:0;
  font-weight:400;
  text-transform:capitalize;
  color:${TextColorType.Gray};

  ::after{
    content:'${(props:{ content: CardLabel })=>props.content.long}';
  }

  @media (max-width: 600px){
  ::after{
    content:'${(props:{ content: CardLabel })=>props.content.short}';
  }
  }
`;

const Data = styled.h2`
  margin:0;
  text-transform:capitalize;
  color:${(props: { color: TextColorType }) => props.color};

  @media (max-width: 600px){
  font-size:18px;
  }
`;

function BasicCard({ label, data, textColor }: BasicCardProps) {
  return (
    <Card>
      <Title content={label} />
      <Data color={textColor}>{data}</Data>
    </Card>
  )
}

export default BasicCard