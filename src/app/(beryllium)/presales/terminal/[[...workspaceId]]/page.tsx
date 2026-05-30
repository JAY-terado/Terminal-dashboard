'use client';

import { useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import WorkspaceView from '../../_components/workspace/workspace-view';
import WorkspaceLayoutSelector from '../../_components/workspace/workspace-layout-selector';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { useWorkspaces } from '../../_components/workspace/workspace-atoms';

export default function TerminalPage() {
  const params = useParams();
  const router = useRouter();
  const { openModal } = useModal();
  const {
    workspaces,
    activeWorkspace,
    activeWorkspaceId,
    setActiveWorkspaceId,
    addWorkspace,
  } = useWorkspaces();

  // Extract optional workspaceId from catch-all segment [[...workspaceId]]
  const paramId = Array.isArray(params?.workspaceId)
    ? params.workspaceId[0]
    : (params?.workspaceId as string | undefined);

  // On mount: activate the workspace specified in the URL (or first available)
  useEffect(() => {
    if (paramId && workspaces.find((w) => w.id === paramId)) {
      setActiveWorkspaceId(paramId);
    } else if (workspaces.length > 0) {
      setActiveWorkspaceId(workspaces[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);

  // Sync the URL when activeWorkspaceId changes (e.g. via tab bar switch)
  useEffect(() => {
    if (activeWorkspaceId && activeWorkspaceId !== paramId) {
      router.replace(`/presales/terminal/${activeWorkspaceId}`, { scroll: false });
    }
  }, [activeWorkspaceId, paramId, router]);

  const handleClose = useCallback(() => {
    // Clear active workspace then go back to dashboard
    setActiveWorkspaceId(null);
    router.push('/presales/dashboard');
  }, [router, setActiveWorkspaceId]);

  const handleAddWorkspace = useCallback(() => {
    openModal({
      view: (
        <WorkspaceLayoutSelector
          onCreate={(name, layoutId) => {
            addWorkspace(layoutId, name);
          }}
        />
      ),
      size: 'lg',
    });
  }, [openModal, addWorkspace]);

  // Show nothing until we have an active workspace
  const workspace = activeWorkspaceId
    ? workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0]
    : workspaces[0];

  if (!workspace) return null;

  return (
    <WorkspaceView
      key={workspace.id}
      layoutId={workspace.layoutId}
      onClose={handleClose}
      onAddWorkspace={handleAddWorkspace}
    />
  );
}
