import React, { useEffect } from 'react'
import styled from 'styled-components';
import { ActionTypes } from './BoardContext';
import { useBoardContext, useBoardUpdateContext } from './BoardContext';
import Button from './Button';
import { ButtonType } from '../global';
import { BoardData, Boards } from '../interfaces/Context.interface';

const ButtonWrapper = styled.div`
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
    gap:10px;
    width:100%;
    position:relative;
`;

function Actions() {

    const boardContext = useBoardContext();
    const boardUpdateContext = useBoardUpdateContext();

    const stepForward = async (): Promise<void> => {
        Object.keys(boardContext.boards).forEach(algorithmKey => {
            boardUpdateContext.dispatch({ type: ActionTypes.STEP_FORWARD, payload: algorithmKey });
        })
    };

    const stepBack = async (): Promise<void> => {
        Object.keys(boardContext.boards).forEach(algorithmKey => {
            boardUpdateContext.dispatch({ type: ActionTypes.STEP_BACK, payload: algorithmKey });
        })
    };

    const resetFunc = (): void => {
        //break the while loop in startAnimation method
        boardUpdateContext.handleCancellationToken(true);

        //to ensure that the pause buttons will be hidden
        boardUpdateContext.dispatch({ type: ActionTypes.REMOVE_PAUSE });

        boardUpdateContext.dispatch({ type: ActionTypes.RESET });
    };

    useEffect(() => {
        if (boardContext.isPaused) {
            boardUpdateContext.handleCancellationToken(true);
        }
    }, [boardContext.isPaused])

    return (
        <ButtonWrapper>
            {Object.values<BoardData>(boardContext.boards).filter(board => !board.isCompleted).length == 0
                ? <Button key='done-reset' buttonType={ButtonType.Reset} handleClickFunc={() => resetFunc()} />
                : boardContext.isPaused
                    ? <>
                        <Button key='prev' buttonType={ButtonType.Previous} handleClickFunc={() => stepBack()}/>
                        <Button key='next' buttonType={ButtonType.Next} handleClickFunc={() => stepForward()}/>
                        <Button key='continue' buttonType={ButtonType.Start} handleClickFunc={() => boardUpdateContext.dispatch({ type: ActionTypes.REMOVE_PAUSE })}/>
                        <Button key='pause-reset' buttonType={ButtonType.Reset} handleClickFunc={() => resetFunc()} />

                    </>
                    : !boardContext.isInExecution
                        ? <>
                            <Button key='execute' buttonType={ButtonType.Start} handleClickFunc={() => boardUpdateContext.dispatch({ type: ActionTypes.START_EXECUTION })}/>
                        </>
                        : <>
                            <Button key='pause' buttonType={ButtonType.Pause} handleClickFunc={() => { boardUpdateContext.dispatch({ type: ActionTypes.SET_PAUSE }) }} />
                            <Button key='execute-reset' buttonType={ButtonType.Reset} handleClickFunc={() => resetFunc()} />
                        </>
            }
        </ButtonWrapper>
    )
}

export default Actions