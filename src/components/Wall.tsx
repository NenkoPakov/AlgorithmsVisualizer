import React from 'react';
import styled from 'styled-components'
import { CellBase,CellText } from '../global';
import {ICell} from '../interfaces/Cell.interface';


const WallCell = styled.div<any>`
${CellBase};
${CellText};
grid-row: ${(props: ICell) => props.row + 1};
grid-column: ${(props: ICell) => props.col + 1};
background-color:black;
transition: background-color 0.8s ease-out;

/* :hover{
  background-color:lightblue ;
}  */
`;

function Wall({ row, col, handleClick }: ICell) {
    const key: string = `${row}-${col}`;

    return <WallCell
        row={row}
        col={col}
        id={key}
        key={key}
        // onMouseUp={(e: MouseEvent) => handleClick(e, row, col)}
        onClick={(e: MouseEvent) => handleClick(e, row, col)}
        onMouseEnter={(e: MouseEvent) => { handleClick(e, row, col)}}
    />

}

export default Wall;