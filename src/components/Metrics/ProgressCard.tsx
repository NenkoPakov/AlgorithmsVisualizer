import React from 'react'
import styled from 'styled-components';
import CircularProgressBar from './CircularProgressBar'
import { BackgroundColorType, TextColorType } from '../../global'
import { AnalyticalCardProps } from '../../interfaces/AnalyticalCard.interface';
import { useBoardContext } from '../BoardContext';
import { BoardData } from '../../interfaces/Context.interface';

const CardContainer = styled.section`
  position:relative;
  display: flex;
  flex-direction:row;
  background-color:white;
  padding:5px 20px 5px 20px;
  background-color: ${BackgroundColorType.Purple};
  border-radius:20px;
  gap:10px;

    @media (max-width: 600px){
      padding:2.5px 10px 2.5px 10px;
      border-radius:10px;
    }
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

    
  @media (max-width: 600px){
      clip-path: circle(20px at 17.5px 12.5px);
      border-top-left-radius:10px;
      width:40px;
      height:40px;
    }
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
  color:${TextColorType.Gray};
`;

const Current = styled.h2`
  margin:0;

  @media (max-width: 600px){
  display:none;
  }
`;

const Target = styled.h5`
  margin:0;
  font-weight:400;

  @media (max-width: 600px){
  display:none;
  }
`;

function ProgressCard() {
  const boardContext = useBoardContext();
  let slowestBoardData = Object.values<BoardData>(boardContext.boards).reduce((largestBoard, currentBoard) => largestBoard.iterationsCount! > currentBoard.iterationsCount! ? largestBoard : currentBoard);

  let progressInPercentages = Math.round(100 / ((slowestBoardData.iterationsCount! - 1) / slowestBoardData.currentIteration));

  return (
    <CardContainer>
      <LightBubble></LightBubble>
      <DataContainer>
        <Title>Progress</Title>
        <Current>{slowestBoardData.currentIteration}</Current>
        <Target>/{slowestBoardData.iterationsCount! - 1}</Target>
      </DataContainer>
      <CircularProgressBar progressInPercentages={progressInPercentages} />
    </CardContainer>
  )
}

export default ProgressCard