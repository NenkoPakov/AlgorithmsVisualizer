import React from 'react'
import styled from 'styled-components';
import { TextColorType } from '../global';
import { DelayType, StatusType } from '../interfaces/BoardManager.interface';
import { CardManagerProps } from '../interfaces/CardManager.interface';
import { BoardData } from '../interfaces/Context.interface';
import AnalyticalCard from './AnalyticalCard';
import BasicCard from './BasicCard';
import { useBoardContext } from './BoardContext';

const CardWrapper = styled.section`
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
    gap:10px;
`;

function CardManager({ rows, cols, wallNodes, delay }: CardManagerProps) {
    const boardContext = useBoardContext();

    let slowestBoardData = Object.values<BoardData>(boardContext.boards).reduce((largestBoard, currentBoard) => largestBoard.iterationsCount! > currentBoard.iterationsCount! ? largestBoard : currentBoard);

    const getCurrentStatus = (): string => {
        return Object.values(boardContext.boards).filter((board: any) => !board.isCompleted).length == 0
            ? StatusType[StatusType.done]
            : boardContext.isPaused
                ? StatusType[StatusType.paused]
                : boardContext.isInExecution
                    ? StatusType[StatusType.running]
                    : StatusType[StatusType.ready]
    };
    return (
        <CardWrapper>
            <BasicCard title="rows count" data={rows} textColor={TextColorType.DarkGray}></BasicCard>
            <BasicCard title="cols count" data={cols} textColor={TextColorType.DarkGray}></BasicCard>
            <BasicCard
                title="walls count"
                data={wallNodes.reduce((curr, row) => curr + row.filter(node => node == true).length, 0)}
                textColor={TextColorType.DarkGray}></BasicCard>
            <BasicCard
                title="delay"
                data={delay}
                textColor={delay == DelayType[DelayType.small]
                    ? TextColorType.Green
                    : delay == DelayType[DelayType.large]
                        ? TextColorType.Red
                        : TextColorType.DarkGray} />
            <BasicCard
                title="status"
                data={getCurrentStatus()}
                textColor={getCurrentStatus() == StatusType[StatusType.done]
                    ? TextColorType.Green
                    : getCurrentStatus() == StatusType[StatusType.paused]
                        ? TextColorType.Red
                        : TextColorType.DarkGray} />
            {/* {slowestBoardData.currentIteration > 0 &&
                <BasicCard
                    title="duration"
                    data={boardContext.duration.current}
                    textColor={TextColorType.DarkGray} />} */}
            {Object.values(boardContext.boards).filter((board: any) => board.isCompleted == true).length > 0 &&
                <BasicCard
                    title="found path"
                    data={boardContext.isFoundPath ? 'yes' : 'no'}
                    textColor={boardContext.isFoundPath == true
                        ? TextColorType.Green
                        : TextColorType.Red} />}
            {slowestBoardData.currentIteration > 0 &&
                <AnalyticalCard
                    title="progress"
                    currentValue={slowestBoardData.currentIteration}
                    //slowestBoardData.iterationsCount-1 because we are skipping the entry for the StartNode
                    targetValue={slowestBoardData.iterationsCount! - 1}
                    progressInPercentages={Math.round(100 / ((slowestBoardData.iterationsCount! - 1) / slowestBoardData.currentIteration))} />}
        </CardWrapper>
    )
}

export default CardManager