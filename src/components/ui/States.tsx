import { type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  children?: ReactNode;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn\'t load this data. Please try again.',
  onRetry,
  children,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
        <AlertTriangle className="h-7 w-7 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-100 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-5">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" />
          Try Again
        </Button>
      )}
      {children}
    </div>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-base-800 border border-base-700">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-100 mb-1">{title}</h3>
      {message && <p className="text-sm text-gray-500 max-w-sm mb-5">{message}</p>}
      {action}
    </div>
  );
}
