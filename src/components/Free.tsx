import React, { memo, useCallback, useEffect } from 'react';
import styled from 'styled-components'
import { CellBase } from '../global';
import { IFreeCell } from '../interfaces/Cell.interface';
import { ActionTypes } from './Board';

// const FreeNode = styled.div.attrs((props: IFreeCell) => ({ 'color': props.isVisited ? 'yellow' : props.isPartOfThePath ? 'white' : 'lightblue' }))`
//  ${CellBase};
//  transition: background-color 0.3s ease-out ;

// :hover{
//   background-color:black ;
// } 
// `

const FreeNode = styled.div<any>`
${CellBase};
background-color:${(props: IFreeCell) => props.isVisited ? 'yellow' : props.isPartOfThePath ? 'white' : 'lightblue'};
transition: background-color 1s ease-out ;

:hover{
  background-color:black ;
} 
`;



function Free({ row, col,isVisited, isPartOfThePath,dispatch }: IFreeCell) {
    const key: string = `${row}-${col}`;

    const _onDragOver = (e:MouseEvent)=>{
      e.preventDefault();
      dispatch({ type: ActionTypes.SET_DRAGGED_NODE_POSITION, payload:{row,col}})
    }

    return <FreeNode
        id={key}
        key={`free-node-${key}`}
        isVisited={isVisited}
        isPartOfThePath={isPartOfThePath}
        onDragOver={(e: MouseEvent) => _onDragOver(e)}
        onClick={(e: MouseEvent) => dispatch({ type: ActionTypes.SET_WALL_START_NODE, payload:{row,col}})}
        onMouseEnter={(e: MouseEvent) => dispatch({ type: ActionTypes.GENERATE_PROPOSAL_WALL, payload:{row,col}})}
    />

}

export default Free;