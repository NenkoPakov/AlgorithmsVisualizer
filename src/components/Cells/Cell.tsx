import { CellProps as CellProps } from '../../interfaces/Cell.interface';
import { createNode } from '../../factories/NodeFactory';
import { memo } from 'react';


const Cell =
  memo(
    ({ value,sideLength, isVisited, isFrontier, isWall, isPartOfThePath, isStart, isFinish, row, col, boardManagerDispatch }: CellProps) => {
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
                  : isFrontier
                    ? 'frontier'
                    : 'free';
      }

      return createNode(value, sideLength, row, col, getCellType(), boardManagerDispatch);
    }
    , (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps));

export default Cell;