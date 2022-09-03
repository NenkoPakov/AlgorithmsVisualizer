import React from 'react'
import styled from 'styled-components';
import CircularProgressBar from './CircularProgressBar'
import { BackgroundColorType, TextColorType } from '../global'
import { AnalyticalCardProps } from '../interfaces/AnalyticalCard.interface';

const CardContainer = styled.section`
  position:relative;
  display: flex;
  flex-direction:row;
  background-color:white;
  padding:5px 20px 5px 20px;
  background-color: ${BackgroundColorType.Purple};
  border-radius:20px;
  gap:10px;
`;

const LightBubble = styled.div`
  top:0;
  left:0;
  position:absolute;
  clip-path: circle(40px at 35px 25px);
  border-top-left-radius:20px;
  width:80px;
  height:80px;
  background-color: ${BackgroundColorType.TransparentWhite};
  z-index: 1;
`;

const DataContainer = styled.div`
  position:relative;
  display: flex;
  flex-direction:column;
  justify-content:center;
  color:white;
`;

const Title = styled.h4`
  margin:0;
  font-weight:400;
  text-transform:capitalize;
  color:${TextColorType.Title};
`;

const Current = styled.h2`
  margin:0;
`;

const Target = styled.h5`
  margin:0;
  font-weight:400;
`;

function AnalyticalCard({ title, currentValue, targetValue, progressInPercentages }: AnalyticalCardProps) {
  return (
    <CardContainer>
      <LightBubble></LightBubble>
      <DataContainer>
        <Title>{title}</Title>
        <Current>{currentValue}</Current>
        <Target>/{targetValue}</Target>
      </DataContainer>
      <CircularProgressBar progressInPercentages={progressInPercentages} />
    </CardContainer>
  )
}

export default AnalyticalCard