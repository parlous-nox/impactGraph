import { useNavigate } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageContainer className="py-20">
      <EmptyState
        icon={<SearchX className="h-7 w-7 text-gray-500" />}
        title="Entity not found"
        message="We couldn't find a package or repository matching that identifier."
        action={<Button variant="secondary" onClick={() => navigate('/explore')}>Back to Explore</Button>}
      />
    </PageContainer>
  );
}
