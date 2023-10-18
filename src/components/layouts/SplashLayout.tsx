import type { ReactElement } from 'react';

import { cn } from '@/lib/utils';

interface IProps {
  className?: string;
}

const SplashLayout = ({ className }: IProps): ReactElement => {
  return (
    <div className={cn('w-full h-full grid place-items-center', className)}>
      <p>Loading...</p>
    </div>
  );
};

export default SplashLayout;
