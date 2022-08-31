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

let minutes = 0;
let seconds = 0;
let milliseconds = 0;
let interval: NodeJS.Timer;

function Actions({ delayFunc }: any) {
    const [isPaused, setIsPaused] = useState(false);

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
        setIsPaused(false);

        boardUpdateContext.dispatch({ type: ActionTypes.RESET });
        resetTimer();
    };

    const startAnimation = async () => {
        boardUpdateContext.handleCancellationToken(false);
        startTimer();

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
            stopTimer();
        }
    }, [isPaused])

    useEffect(() => {
        if (boardContext.isInExecution && !isPaused) {
            startAnimation();
        }
    }, [boardContext.isInExecution, isPaused])

    const timerFunc = () => {
        milliseconds++;

        if (milliseconds > 99) {
            seconds++;
            milliseconds = 0;
            console.log(`${seconds}:${milliseconds}`);
        }

        if (seconds > 59) {
            minutes++;
            seconds = 0;
        }

        boardContext.timer.current = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}:${milliseconds < 10 ? `0${milliseconds}` : milliseconds}`;
    }

    const startTimer = () => {
        clearInterval(interval);
        interval = setInterval(timerFunc, 10);
    }

    const stopTimer = () => {
        clearInterval(interval);
    }

    const resetTimer = () => {
        clearInterval(interval);
        minutes = 0;
        seconds = 0;
        milliseconds = 0;
    }


    return (
        <ButtonWrapper>
            {Object.values(boardContext.boards).filter((board: any) => !board.isCompleted).length == 0
                ? <Button key='reset' handleClickFunc={() => resetFunc()} isForStart={false} >Reset</Button>
                : isPaused
                    ? <>
                        <Button key='prev' buttonType={ButtonTypes.Previous} handleClickFunc={() => stepBack()} isForStart={true} ></Button>
                        <Button key='next' buttonType={ButtonTypes.Next} handleClickFunc={() => stepFurther()} isForStart={true} ></Button>
                        <Button key='continue' buttonType={ButtonTypes.Start} handleClickFunc={() => setIsPaused(false)} isForStart={true} ></Button>
                        <Button key='reset' buttonType={ButtonTypes.Reset} handleClickFunc={() => resetFunc()} isForStart={false} ></Button>

                    </>
                    : !boardContext.isInExecution
                        ? <>
                            <Button key='execute' buttonType={ButtonTypes.Start} handleClickFunc={() => boardUpdateContext.dispatch({ type: ActionTypes.START_EXECUTION })} isForStart={true} ></Button>
                        </>
                        : <>
                            <Button key='pause' buttonType={ButtonTypes.Pause} handleClickFunc={() => { setIsPaused(true), boardUpdateContext.handleCancellationToken(true) }} isForStart={false} >Pause</Button>
                            <Button key='reset2' buttonType={ButtonTypes.Reset} handleClickFunc={() => resetFunc()} isForStart={false} >Reset</Button>
                        </>
            }
            {/* <Button key='reset' icon={NextIcon}  handleClickFunc={() => { boardUpdateContext.handleCancellationToken(true), boardUpdateContext.dispatch({ type: ActionTypes.RESET }) }} isForStart={false} >Reset</Button> */}
        </ButtonWrapper>
    )
}

export default Actions