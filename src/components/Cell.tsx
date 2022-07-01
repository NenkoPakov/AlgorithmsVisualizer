import React, { MouseEventHandler } from 'react';
import styled, { css } from 'styled-components'
import { ICell2, CellTypeColor } from '../interfaces/Cell.interface';
import { createNode } from '../NodeFactory';


function Cell({ isVisited, isWall, isPartOfThePath, isStart, isFinish, row, col, handleClick, pressedCellType }: ICell2) {
  const key: string = `${row}-${col}`;

  const getCellType = () => {
    return isStart
      ? 'start'
      : isFinish
        ? 'finish'
        : isWall
          ? 'wall'
          : isPartOfThePath
            ? 'path'
            : isVisited
              ? 'visited'
              : 'free';
  }

  return createNode(row, col, getCellType(), handleClick);

}

export default Cell;