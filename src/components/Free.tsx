import React from 'react';
import styled from 'styled-components'
import { CellBase,CellText } from '../global';
import {IFreeCell} from '../interfaces/Cell.interface';


const FreeNode = styled.div<any>`
${CellBase};
${CellText};
grid-row: ${(props: IFreeCell) => props.row + 1};
grid-column: ${(props: IFreeCell) => props.col + 1};
background-color:${(props: IFreeCell) => props.isVisited?'yellow':props.isPartOfThePath?'white':'lightblue'};
transition: background-color 0.3s ease-out ;

:hover{
  background-color:black ;
} 
`;

function Free({ row, col, handleClick,isVisited, isPartOfThePath }: IFreeCell) {
    const key: string = `${row}-${col}`;

    return <FreeNode
        row={row}
        col={col}
        id={key}
        key={key}
        isVisited={isVisited}
        isPartOfThePath={isPartOfThePath}
        // onMouseDown={(e: MouseEvent) => handleClick(e, row, col)}
        onClick={(e: MouseEvent) => handleClick(e, row, col)}
        onMouseEnter={(e: MouseEvent) => { handleClick(e, row, col)}}
    />

}

export default Free;