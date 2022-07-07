import { INodeFactory } from '../interfaces/Cell.interface';
import { createNode } from '../factories/NodeFactory';
import { memo } from 'react';


const Cell =
  memo(
    ({value, isVisited, isWall, isPartOfThePath, isStart, isFinish, row, col, dispatch }: INodeFactory) => {
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

      return createNode(value, row, col, getCellType(), dispatch);
    }
    , (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps));

export default Cell;