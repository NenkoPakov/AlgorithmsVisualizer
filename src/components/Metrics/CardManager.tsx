import React from 'react'
import styled from 'styled-components';
import { CardLabels, TextColorType } from '../../global';
import { DelayType, StatusType } from '../../interfaces/BoardManager.interface';
import { CardManagerProps } from '../../interfaces/CardManager.interface';
import { BoardData } from '../../interfaces/Context.interface';
import ProgressCard from './ProgressCard';
import BasicCard from './BasicCard';
import { useBoardContext } from './../BoardContext';

const CardWrapper = styled.section`
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
    gap:10px;
`;

function CardManager({ rows, cols, wallNodes, delay }: CardManagerProps) {
    const boardContext = useBoardContext();

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
            <BasicCard label={CardLabels.row} data={rows} textColor={TextColorType.DarkGray}></BasicCard>
            <BasicCard label={CardLabels.col} data={cols} textColor={TextColorType.DarkGray}></BasicCard>
            <BasicCard
                label={CardLabels.wall}
                data={wallNodes.reduce((curr, row) => curr + row.filter(node => node == true).length, 0)}
                textColor={TextColorType.DarkGray}></BasicCard>
            <BasicCard
                label={CardLabels.delay}
                data={delay}
                textColor={delay == DelayType[DelayType.small]
                    ? TextColorType.Green
                    : delay == DelayType[DelayType.large]
                        ? TextColorType.Red
                        : TextColorType.DarkGray} />
            <BasicCard
                label={CardLabels.status}
                data={getCurrentStatus()}
                textColor={getCurrentStatus() == StatusType[StatusType.done]
                    ? TextColorType.Green
                    : getCurrentStatus() == StatusType[StatusType.paused]
                        ? TextColorType.Red
                        : TextColorType.DarkGray} 
            />
            {Object.values(boardContext.boards).filter((board: any) => board.isCompleted == true).length > 0 &&
                <BasicCard
                    label={CardLabels.path}
                    data={boardContext.isFoundPath ? 'yes' : 'no'}
                    textColor={boardContext.isFoundPath == true
                        ? TextColorType.Green
                        : TextColorType.Red} />}
            {boardContext.isInExecution && Object.keys(boardContext.boards).length &&
                <ProgressCard />}
        </CardWrapper>
    )
}

export default CardManager