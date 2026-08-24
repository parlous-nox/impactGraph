import { type EntityType } from '@/api/types';
import { Package, GitBranch, Building2 } from 'lucide-react';

interface EntityBadgeProps {
  type: EntityType;
  size?: 'sm' | 'md';
}

const config: Record<EntityType, { label: string; icon: typeof Package; color: string }> = {
  package: {
    label: 'PACKAGE',
    icon: Package,
    color: 'text-accent-400 bg-accent-500/10 border-accent-500/20',
  },
  repository: {
    label: 'REPOSITORY',
    icon: GitBranch,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  organization: {
    label: 'ORGANIZATION',
    icon: Building2,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
};

export function EntityBadge({ type, size = 'sm' }: EntityBadgeProps) {
  const { label, icon: Icon, color } = config[type];
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium uppercase tracking-wider ${color} ${sizeClass}`}
    >
      <Icon className={iconSize} />
      {label}
    </span>
  );
}
