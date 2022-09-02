import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components';
import { ActionTypes } from './BoardContext';
import { useBoardContext, useBoardUpdateContext } from './BoardContext';
import Button from './Button';
import { ButtonTypes } from '../global';

const ButtonWrapper = styled.div`
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  gap:10px;
  /* height:80px; */
  width:100%;
  position:relative;
  `;

function Actions({ delayFunc }: any) {

    const boardContext = useBoardContext();
    const boardUpdateContext = useBoardUpdateContext();

    const stepFurther = async () => {
        Object.keys(boardContext.boards).forEach(algorithmKey => {
            boardUpdateContext.dispatch({ type: ActionTypes.STEP_FURTHER, payload: algorithmKey });
        })
    };

    const stepBack = async () => {
        Object.keys(boardContext.boards).forEach(algorithmKey => {
            boardUpdateContext.dispatch({ type: ActionTypes.STEP_BACK, payload: algorithmKey });
        })
    };

    const resetFunc = () => {
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
            {Object.values(boardContext.boards).filter((board: any) => !board.isCompleted).length == 0
                ? <Button key='reset' buttonType={ButtonTypes.Reset} handleClickFunc={() => resetFunc()} isForStart={false} >Reset</Button>
                : boardContext.isPaused
                    ? <>
                        <Button key='prev' buttonType={ButtonTypes.Previous} handleClickFunc={() => stepBack()} isForStart={true} ></Button>
                        <Button key='next' buttonType={ButtonTypes.Next} handleClickFunc={() => stepFurther()} isForStart={true} ></Button>
                        <Button key='continue' buttonType={ButtonTypes.Start} handleClickFunc={() => boardUpdateContext.dispatch({ type: ActionTypes.REMOVE_PAUSE })} isForStart={true} ></Button>
                        <Button key='reset' buttonType={ButtonTypes.Reset} handleClickFunc={() => resetFunc()} isForStart={false} ></Button>

                    </>
                    : !boardContext.isInExecution
                        ? <>
                            <Button key='execute' buttonType={ButtonTypes.Start} handleClickFunc={() => boardUpdateContext.dispatch({ type: ActionTypes.START_EXECUTION })} isForStart={true} ></Button>
                        </>
                        : <>
                            <Button key='pause' buttonType={ButtonTypes.Pause} handleClickFunc={() => { boardUpdateContext.dispatch({ type: ActionTypes.SET_PAUSE })}} isForStart={false} >Pause</Button>
                            <Button key='reset2' buttonType={ButtonTypes.Reset} handleClickFunc={() => resetFunc()} isForStart={false} >Reset</Button>
                        </>
            }
            {/* <Button key='reset' icon={NextIcon}  handleClickFunc={() => { boardUpdateContext.handleCancellationToken(true), boardUpdateContext.dispatch({ type: ActionTypes.RESET }) }} isForStart={false} >Reset</Button> */}
        </ButtonWrapper>
    )
}

export default Actions