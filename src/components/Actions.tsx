import React, { useCallback } from 'react'
import styled from 'styled-components';
import { ActionTypes } from './BoardManager';
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

function Actions({ dispatch, delayFunc }: any) {
    const boardContext = useBoardContext();
    const boardUpdateContext = useBoardUpdateContext();

    const startAnimation = async () => {
        boardUpdateContext.handleCancellation(false);
        boardUpdateContext.handleExecution(true);

        while (!boardContext.isCancelled.current) {
            dispatch({ type: ActionTypes.STEP_FURTHER })

            await delayFunc()
        }

        boardUpdateContext.handleExecution(false);
    }

    return (
        <ButtonWrapper>
            {boardContext.isCancelled.current
                ? <>
                    <Button key='continue' text='continue' handleClickFunc={() => startAnimation()} isForStart={true} >Continue</Button>
                    <Button key='continue' text='next' handleClickFunc={() => dispatch({ type: ActionTypes.STEP_FURTHER })} isForStart={true} >Next</Button>
                    <Button key='continue' text='prev' handleClickFunc={() => dispatch({ type: ActionTypes.STEP_BACK })} isForStart={true} >Previous</Button>
                </>
                : !boardContext.isInExecution
                    ? <>
                        <Button key='execute' text='execute' handleClickFunc={() => startAnimation()} isForStart={true} >Execute</Button>
                    </>
                    : <>
                        <Button key='pause' text='pause' handleClickFunc={() => boardUpdateContext.handleCancellation(true)} isForStart={false} >Pause</Button>
                    </>
            }
            <Button key='clear' text='clear' handleClickFunc={() => boardUpdateContext.handleExecution(false)} isForStart={false} >Clear board</Button>
        </ButtonWrapper>
    )
}

export default Actions