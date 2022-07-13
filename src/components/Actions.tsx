import React from 'react'
import styled from 'styled-components';
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

function Actions() {
    const boardContext = useBoardContext();
    const boardUpdateContext = useBoardUpdateContext();

    return (

        // <button key='execute' onClick={() => executeAlgorithm()}>Execute</button>
        // <button key='clear' onClick={() => clearMatrix()}>Clear board</button>
        // <button key='pause' onClick={() => isCancelled.current = true}>Pause</button>
        // <button key='continue' onClick={() => { isCancelled.current = false, executeAlgorithm() }}>Continue</button>
        boardContext.isInExecution
            ? <ButtonWrapper>
                <Button key='continue' text='continue' handleClickFunc={() => { boardUpdateContext.handleCancellation(false)}} isForStart={true} >Continue</Button>
                <Button key='pause' text='pause' handleClickFunc={() => { boardUpdateContext.handleCancellation(true)}} isForStart={false} >Pause</Button>
            </ButtonWrapper>
            : <ButtonWrapper>
                <Button key='execute' text='execute' handleClickFunc={() => boardUpdateContext.handleExecution(true)} isForStart={true} >Execute</Button>
                <Button key='clear' text='clear' handleClickFunc={() => boardUpdateContext.handleExecution(false)} isForStart={false} >Clear board</Button>
            </ButtonWrapper>
    )
}

export default Actions