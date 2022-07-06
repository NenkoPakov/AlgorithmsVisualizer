import { ICell2 } from '../interfaces/Cell.interface';
import { createNode } from '../factories/NodeFactory';
import { memo, useEffect, useMemo } from 'react';


const Cell =
memo(
  ({ isVisited, isWall, isPartOfThePath, isStart, isFinish, row, col, dispatch }: ICell2) =>{
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

    // const memoizedValue = useMemo(() => getCellType(), [{ isVisited, isWall, isPartOfThePath, isStart, isFinish, row, col, handleClick }]);

  return createNode(row, col, getCellType(), dispatch);
}
,(prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps));

export default Cell;