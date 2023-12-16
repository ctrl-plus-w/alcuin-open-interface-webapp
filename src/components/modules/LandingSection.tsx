import React from 'react';

import { TypographyH2 } from '@/ui/typography';

import { cn } from '@/util/style.util';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children?: React.ReactNode;
  className?: string;
}
const LandingSection = ({ title, children, ...props }: IProps) => {
  return (
    <section
      {...props}
      className={cn(
        'min-h-screen md:min-h-[80vh] flex flex-col justify-center items-center pt-24 px-7',
        props.className,
      )}
    >
      <div className="w-full flex flex-col items-center gap-7 mb-8">
        <TypographyH2 className="text-2xl md:text-4xl max-w-md text-center border-b-0">{title}</TypographyH2>

        <div className="w-full h-px bg-gradient-to-l from-transparent via-border to-transparent"></div>
      </div>

      {children}
    </section>
  );
};

export default LandingSection;
