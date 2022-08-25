import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components';
import { ActionTypes } from './BoardContext';
import { useBoardContext, useBoardUpdateContext } from './BoardContext';
import Button from './Button'

const ButtonWrapper = styled.div`
  display:flex;
  flex-direction:row;
  gap:10px;
  height:80px;
  width:100%;
  position:relative;
  `;

function Actions({ delayFunc }: any) {
    const [isPaused, setIsPaused] = useState(false);

    const boardContext = useBoardContext();
    const boardUpdateContext = useBoardUpdateContext();

    const stepFurther = async () => {
        Object.keys(boardContext.boards).forEach(key => {
            boardUpdateContext.dispatch({ type: ActionTypes.STEP_FURTHER, payload: key });
        })
    };

    const stepBack = async () => {
        Object.keys(boardContext.boards).forEach(key => {
            boardUpdateContext.dispatch({ type: ActionTypes.STEP_BACK, payload: key });
        })
    };

    const resetFunc = () => {
        //break the while loop in startAnimation method
        boardUpdateContext.handleCancellationToken(true);

        //to ensure that the pause buttons will be hidden
        setIsPaused(false);

        boardUpdateContext.dispatch({ type: ActionTypes.RESET });
    };

    const startAnimation = async () => {
        boardUpdateContext.handleCancellationToken(false);

        while (!boardContext.cancellationToken.current) {
            Object.keys(boardContext.boards).forEach(algorithmKey => {
                if (!boardContext.boards[algorithmKey].isCompleted) {
                    boardUpdateContext.dispatch({ type: ActionTypes.STEP_FURTHER, payload: algorithmKey });
                }
            })

            await delayFunc();
        }
    }

    useEffect(() => {
        if (isPaused) {
            boardUpdateContext.handleCancellationToken(true);
        }
    }, [isPaused])

    useEffect(() => {
        if (boardContext.isInExecution && !isPaused) {
            startAnimation();
        }
    }, [boardContext.isInExecution, isPaused])

    return (
        <ButtonWrapper>
            {Object.values(boardContext.boards).filter((board: any) => !board.isCompleted).length==0
                ? <Button key='reset' text='reset' handleClickFunc={() => resetFunc()} isForStart={false} >Reset</Button>
                : isPaused
                    ? <>
                        <Button key='continue' text='continue' handleClickFunc={() => setIsPaused(false)} isForStart={true} >Continue</Button>
                        <Button key='next' text='next' handleClickFunc={() => stepFurther()} isForStart={true} >Next</Button>
                        <Button key='prev' text='prev' handleClickFunc={() => stepBack()} isForStart={true} >Previous</Button>
                        <Button key='reset' text='reset' handleClickFunc={() => resetFunc()} isForStart={false} >Reset</Button>
                    </>
                    : !boardContext.isInExecution
                        ? <>
                            <Button key='execute' text='execute' handleClickFunc={() => boardUpdateContext.dispatch({ type: ActionTypes.START_EXECUTION })} isForStart={true} >Execute</Button>
                        </>
                        : <>
                            <Button key='pause' text='pause' handleClickFunc={() => { setIsPaused(true), boardUpdateContext.handleCancellationToken(true) }} isForStart={false} >Pause</Button>
                            <Button key='reset2' text='reset' handleClickFunc={() => resetFunc()} isForStart={false} >Reset</Button>
                        </>
            }
            {/* <Button key='reset' text='reset' handleClickFunc={() => { boardUpdateContext.handleCancellationToken(true), boardUpdateContext.dispatch({ type: ActionTypes.RESET }) }} isForStart={false} >Reset</Button> */}
        </ButtonWrapper>
    )
}

export default Actions