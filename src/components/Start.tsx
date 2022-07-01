import React from 'react';
import styled from 'styled-components'
import { CellBase,CellText } from '../global';
import {ICell} from '../interfaces/Cell.interface';


const StartNode = styled.div<any>`
${CellBase};
${CellText};
grid-row: ${(props: ICell) => props.row + 1};
grid-column: ${(props: ICell) => props.col + 1};
background-color:green;

:hover{
  transform:scale(1.2);
} 
`;

function Start({ row, col, handleClick }: ICell) {
    const key: string = `${row}-${col}`;

    return <StartNode
        row={row}
        col={col}
        id={key}
        key={key}
        onMouseDown={(e: MouseEvent) =>handleClick(e, row, col)}
        onMouseUp={(e: MouseEvent) =>handleClick(e, row, col)}
    />

}

export default Start;