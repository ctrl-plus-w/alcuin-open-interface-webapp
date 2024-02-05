import React from 'react';

import { cn } from '@/util/style.util';

export enum Side {
  top,
  left,
  bottom,
  right,
}

interface IProps {
  children?: React.ReactNode;

  containerClassName?: string;
  className?: string;

  side?: Side;
}

const FadedSide = ({ children, containerClassName, className, side = Side.bottom }: IProps) => {
  return (
    <div className={cn('relative', containerClassName)}>
      <div
        className={cn(
          'z-50 absolute inset-0 from-90% from-transparent to-background pointer-events-none',
          side === Side.top && 'bg-gradient-to-t',
          side === Side.bottom && 'bg-gradient-to-b',
          side === Side.left && 'bg-gradient-to-l',
          side === Side.right && 'bg-gradient-to-r',
        )}
      ></div>
      <div className={cn('relative', className)}>{children}</div>
    </div>
  );
};

export default FadedSide;
