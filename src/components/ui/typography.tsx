import { cn } from '@/lib/utils';

interface IProps {
  className?: string;
  children?: React.ReactNode;
}

export function TypographyH1({ children, className }: IProps) {
  return (
    <h1 className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl', className)}>{children}</h1>
  );
}

export function TypographyH2({ children, className }: IProps) {
  return (
    <h2
      className={cn(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function TypographyH3({ children, className }: IProps) {
  return <h3 className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)}>{children}</h3>;
}

export function TypographyH4({ children, className }: IProps) {
  return <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)}>{children}</h4>;
}

export function TypographyP({ children, className }: IProps) {
  return <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}>{children}</p>;
}

export function TypographyBlockquote({ children, className }: IProps) {
  return <blockquote className={cn('mt-6 border-l-2 pl-6 italic', className)}>{children}</blockquote>;
}

export function TypographyList({ children, className }: IProps) {
  return <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}>{children}</ul>;
}

export function TypographyInlineCode({ children, className }: IProps) {
  return (
    <code
      className={cn('relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', className)}
    >
      {children}
    </code>
  );
}
