'use client';

import Header from '@/layouts/beryllium/beryllium-header';
import BerylliumLeftSidebarFixed from '@/layouts/beryllium/beryllium-left-sidebar-fixed';
import cn from '@core/utils/class-names';
import SidebarExpandable from '@/layouts/beryllium/beryllium-sidebar-expanded';
import { useBerylliumSidebars } from '@/layouts/beryllium/beryllium-utils';
import { useWorkspaces } from '@/app/(beryllium)/presales/_components/workspace/workspace-atoms';
import WorkspaceView from '@/app/(beryllium)/presales/_components/workspace/workspace-view';
import { useModal } from '@/app/shared/modal-views/use-modal';
import WorkspaceLayoutSelector from '@/app/(beryllium)/presales/_components/workspace/workspace-layout-selector';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BerylliumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { expandedLeft } = useBerylliumSidebars();
  const pathname = usePathname();
  const { activeWorkspace, activeWorkspaceId, setActiveWorkspaceId, addWorkspace } = useWorkspaces();
  const { openModal } = useModal();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Detect if we are on the dedicated terminal page
  const isTerminalRoute = pathname?.startsWith('/presales/terminal');

  // When navigating AWAY from a terminal route, clear activeWorkspaceId from localStorage
  // so that returning to the dashboard never auto-triggers the overlay.
  useEffect(() => {
    if (!isTerminalRoute && activeWorkspaceId) {
      setActiveWorkspaceId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTerminalRoute]);

  // If we haven't mounted yet, render a skeleton or nothing to prevent hydration mismatch
  if (!hasMounted) return null;

  // On the terminal route the page component owns WorkspaceView – render children directly.
  if (isTerminalRoute) {
    return <>{children}</>;
  }

  // Legacy: workspace overlay triggered from the dashboard page button
  if (activeWorkspaceId) {
    return (
      <WorkspaceView
        layoutId={activeWorkspace.layoutId}
        onClose={() => setActiveWorkspaceId(null)}
        onAddWorkspace={() =>
          openModal({
            view: (
              <WorkspaceLayoutSelector
                onCreate={(name, layoutId) => addWorkspace(layoutId, name)}
              />
            ),
            customSize: 800,
          })
        }
      />
    );
  }

  return (
    <main className={cn('flex min-h-screen flex-grow')}>
      <BerylliumLeftSidebarFixed />
      <SidebarExpandable />
      <div className="flex w-full flex-col">
        <Header className="xl:ms-[88px]" />
        <div
          className={cn(
            'flex flex-grow flex-col gap-4 px-4 pb-6 duration-200 md:px-5 lg:pb-8 xl:pe-8',
            expandedLeft ? 'xl:ps-[414px]' : 'xl:ps-[110px]'
          )}
        >
          <div className="grow xl:mt-4">{children}</div>
        </div>
      </div>
    </main>
  );
}
