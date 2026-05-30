import { metaObject } from '@/config/site.config';
import DashboardContent from './dashboard-content';
import PageAnimateWrapper from '@/app/shared/page-animate-wrapper';

export const metadata = {
  ...metaObject('Dashboard | Pre-Sales Real Estate'),
};

export default function DashboardPage() {
  return (
    <PageAnimateWrapper>
      <DashboardContent />
    </PageAnimateWrapper>
  );
}
