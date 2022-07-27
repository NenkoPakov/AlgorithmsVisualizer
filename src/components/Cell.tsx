import { INodeFactory } from '../interfaces/Cell.interface';
import { createNode } from '../factories/NodeFactory';
import { memo, useRef } from 'react';


const Cell =
  memo(
    ({ value, isVisited, isFrontier, isWall, isPartOfThePath, isStart, isFinish, row, col, dispatch }: INodeFactory) => {
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

      return createNode(value, row, col, getCellType(), dispatch);
    }
    , (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps));

export default Cell;