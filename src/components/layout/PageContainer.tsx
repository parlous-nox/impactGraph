import { type ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'default' | 'wide' | 'full';
}

const widthClasses = {
  default: 'max-w-5xl',
  wide: 'max-w-7xl',
  full: 'max-w-full',
};

export function PageContainer({
  children,
  className = '',
  maxWidth = 'default',
}: PageContainerProps) {
  return (
    <div className={`mx-auto w-full ${widthClasses[maxWidth]} px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
