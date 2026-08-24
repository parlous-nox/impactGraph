import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  children?: ReactNode;
}

export function LoadingState({ message = 'Loading...', children }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      {children ?? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10 border border-accent-500/20">
          <Loader2 className="h-6 w-6 text-accent-400 animate-spin" />
        </div>
      )}
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

export function InlineLoader({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <Loader2 className="h-3.5 w-3.5 animate-spin text-accent-400" />
      {message ?? 'Loading...'}
    </div>
  );
}
