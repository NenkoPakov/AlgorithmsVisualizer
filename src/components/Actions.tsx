import React, { useCallback, useEffect } from 'react'
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
    const boardContext = useBoardContext();
    const boardUpdateContext = useBoardUpdateContext();

    const startAnimation = async () => {
        boardUpdateContext.handleExecutionCancellation(false);
        boardUpdateContext.dispatch({ type: ActionTypes.START_EXECUTION })

        while (!boardContext.isExecutionCancelled.current) {
            boardUpdateContext.dispatch({ type: ActionTypes.STEP_FURTHER });

            await delayFunc();
        }

        boardUpdateContext.dispatch({ type: ActionTypes.STOP_EXECUTION })
    }

    return (
        <ButtonWrapper>
            {boardContext.isExecutionCancelled.current
                ? <>
                    <Button key='continue' text='continue' handleClickFunc={() => startAnimation()} isForStart={true} >Continue</Button>
                    <Button key='continue' text='next' handleClickFunc={() => boardUpdateContext.dispatch({ type: ActionTypes.STEP_FURTHER })} isForStart={true} >Next</Button>
                    <Button key='continue' text='prev' handleClickFunc={() => boardUpdateContext.dispatch({ type: ActionTypes.STEP_BACK })} isForStart={true} >Previous</Button>
                </>
                : !boardContext.isInExecution
                    ? <>
                        <Button key='execute' text='execute' handleClickFunc={() => startAnimation()} isForStart={true} >Execute</Button>
                    </>
                    : <>
                        <Button key='pause' text='pause' handleClickFunc={() => boardUpdateContext.handleExecutionCancellation(true)} isForStart={false} >Pause</Button>
                    </>
            }
            <Button key='reset' text='reset' handleClickFunc={() => {boardUpdateContext.handleExecutionCancellation(false), boardUpdateContext.dispatch({ type: ActionTypes.RESET })}} isForStart={false} >Reset</Button>
        </ButtonWrapper>
    )
}

export default Actions