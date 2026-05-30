'use client';

import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { createId } from '@paralleldrive/cuid2';

export interface PanelTab {
  id: string;
  widgetId: string;
  label: string;
}

export type PanelTabsMap = Record<string, PanelTab[]>;
export type ActiveTabMap = Record<string, string>;

export interface Workspace {
  id: string;
  name: string;
  layoutId: string;
  panelTabs: PanelTabsMap;
  activePanelTabId: ActiveTabMap;
  maximizedPanelId: string | null;
}

const DEFAULT_WORKSPACES: Workspace[] = [
  {
    id: 'default-1',
    name: 'Trade Desk',
    layoutId: 'trade',
    panelTabs: {
      'p1': [{ id: 'tab-p1-1', widgetId: 'by-region',   label: 'Region Chart'     }],
      'p2': [{ id: 'tab-p2-1', widgetId: 'total-leads',  label: 'Total Leads'      }],
      'p3': [{ id: 'tab-p3-1', widgetId: 'by-status',    label: 'Status Breakdown' }],
      'p4': [{ id: 'tab-p4-1', widgetId: 'my-team',      label: 'Team Performance' }],
    },
    activePanelTabId: {
      'p1': 'tab-p1-1', 'p2': 'tab-p2-1', 'p3': 'tab-p3-1', 'p4': 'tab-p4-1'
    },
    maximizedPanelId: null
  }
];

export const workspacesAtom = atomWithStorage<Workspace[]>('presales-workspaces', DEFAULT_WORKSPACES);
export const activeWorkspaceIdAtom = atomWithStorage<string | null>('presales-active-ws', null);

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useAtom(workspacesAtom);
  const [activeWorkspaceId, setActiveWorkspaceId] = useAtom(activeWorkspaceIdAtom);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  // Ensure activeWorkspace has the required structure (migration for stale localStorage)
  if (activeWorkspace) {
    if (!activeWorkspace.panelTabs) activeWorkspace.panelTabs = {};
    if (!activeWorkspace.activePanelTabId) activeWorkspace.activePanelTabId = {};
    if (activeWorkspace.maximizedPanelId === undefined) activeWorkspace.maximizedPanelId = null;
  }

  const addWorkspace = (layoutId: string, name?: string) => {
    const p1Id = createId();
    const p2Id = createId();
    const p3Id = createId();
    const p4Id = createId();
    
    const newWorkspace: Workspace = {
      id: createId(),
      name: name || `Workspace ${workspaces.length + 1}`,
      layoutId,
      panelTabs: {
        'p1': [{ id: p1Id, widgetId: 'by-region',   label: 'Region Chart'     }],
        'p2': [{ id: p2Id, widgetId: 'total-leads',  label: 'Total Leads'      }],
        'p3': [{ id: p3Id, widgetId: 'by-status',    label: 'Status Breakdown' }],
        'p4': [{ id: p4Id, widgetId: 'my-team',      label: 'Team Performance' }],
      },
      activePanelTabId: {
        'p1': p1Id, 'p2': p2Id, 'p3': p3Id, 'p4': p4Id
      },
      maximizedPanelId: null
    };
    setWorkspaces([...workspaces, newWorkspace]);
    setActiveWorkspaceId(newWorkspace.id);
  };

  const deleteWorkspace = (id: string) => {
    if (workspaces.length <= 1) return;
    const newWorkspaces = workspaces.filter(w => w.id !== id);
    setWorkspaces(newWorkspaces);
    if (activeWorkspaceId === id) {
      setActiveWorkspaceId(newWorkspaces[0].id);
    }
  };

  const duplicateWorkspace = (id: string) => {
    const source = workspaces.find(w => w.id === id);
    if (!source) return;
    
    const newWs: Workspace = {
      ...(JSON.parse(JSON.stringify(source)) as Workspace), // deep clone
      id: createId(),
      name: `${source.name} (copy)`,
    };
    
    // Re-generate all tab ids to avoid collisions
    Object.keys(newWs.panelTabs).forEach(panelId => {
      const oldActiveId = source.activePanelTabId[panelId];
      newWs.panelTabs[panelId] = newWs.panelTabs[panelId].map(tab => {
        const newId = createId();
        if (tab.id === oldActiveId) newWs.activePanelTabId[panelId] = newId;
        return { ...tab, id: newId };
      });
    });
    
    setWorkspaces([...workspaces, newWs]);
    setActiveWorkspaceId(newWs.id);
  };

  const addPanelTab = (workspaceId: string, panelId: string, widgetId: string, label: string) => {
    const newTab: PanelTab = {
      id: createId(),
      widgetId,
      label
    };
    setWorkspaces(prev => prev.map(w => {
      if (w.id === workspaceId) {
        return {
          ...w,
          panelTabs: {
            ...w.panelTabs,
            [panelId]: [...(w.panelTabs[panelId] || []), newTab]
          },
          activePanelTabId: {
            ...w.activePanelTabId,
            [panelId]: newTab.id
          }
        };
      }
      return w;
    }));
  };

  const removePanelTab = (workspaceId: string, panelId: string, tabId: string) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === workspaceId) {
        const tabs = w.panelTabs[panelId] || [];
        if (tabs.length <= 1) return w;
        
        const newTabs = tabs.filter(t => t.id !== tabId);
        let newActiveId = w.activePanelTabId[panelId];
        
        if (newActiveId === tabId) {
          const removedIndex = tabs.findIndex(t => t.id === tabId);
          newActiveId = newTabs[Math.max(0, removedIndex - 1)].id;
        }

        return {
          ...w,
          panelTabs: {
            ...w.panelTabs,
            [panelId]: newTabs
          },
          activePanelTabId: {
            ...w.activePanelTabId,
            [panelId]: newActiveId
          }
        };
      }
      return w;
    }));
  };

  const setActivePanelTab = (workspaceId: string, panelId: string, tabId: string) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === workspaceId) {
        return {
          ...w,
          activePanelTabId: {
            ...w.activePanelTabId,
            [panelId]: tabId
          }
        };
      }
      return w;
    }));
  };

  const updatePanelTab = (workspaceId: string, panelId: string, tabId: string, widgetId: string, label: string) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === workspaceId) {
        return {
          ...w,
          panelTabs: {
            ...w.panelTabs,
            [panelId]: (w.panelTabs[panelId] || []).map(t => 
              t.id === tabId ? { ...t, widgetId, label } : t
            )
          }
        };
      }
      return w;
    }));
  };

  const reorderPanelTabs = (workspaceId: string, panelId: string, newTabIds: string[]) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === workspaceId) {
        const currentTabs = w.panelTabs[panelId] || [];
        const reorderedTabs = newTabIds
          .map(id => currentTabs.find(t => t.id === id))
          .filter((t): t is PanelTab => !!t);
        
        return {
          ...w,
          panelTabs: {
            ...w.panelTabs,
            [panelId]: reorderedTabs
          }
        };
      }
      return w;
    }));
  };

  /**
   * Move a tab from sourcePanelId to targetPanelId.
   * If the tab is the last one in the source panel the operation is blocked.
   */
  const moveTabToPanel = (
    workspaceId: string,
    tabId: string,
    sourcePanelId: string,
    targetPanelId: string,
    targetIndex?: number
  ) => {
    if (sourcePanelId === targetPanelId) return;
    setWorkspaces(prev => prev.map(w => {
      if (w.id !== workspaceId) return w;

      const sourceTabs = w.panelTabs[sourcePanelId] || [];
      if (sourceTabs.length <= 1) return w; // keep at least 1 tab per panel

      const tab = sourceTabs.find(t => t.id === tabId);
      if (!tab) return w;

      const newSourceTabs = sourceTabs.filter(t => t.id !== tabId);

      // Fix source active tab if we removed the active one
      let newSourceActiveId = w.activePanelTabId[sourcePanelId];
      if (newSourceActiveId === tabId) {
        const removedIdx = sourceTabs.findIndex(t => t.id === tabId);
        newSourceActiveId = newSourceTabs[Math.max(0, removedIdx - 1)].id;
      }

      const targetTabs = [...(w.panelTabs[targetPanelId] || [])];
      if (typeof targetIndex === 'number') {
        targetTabs.splice(targetIndex, 0, tab);
      } else {
        targetTabs.push(tab);
      }

      return {
        ...w,
        panelTabs: {
          ...w.panelTabs,
          [sourcePanelId]: newSourceTabs,
          [targetPanelId]: targetTabs,
        },
        activePanelTabId: {
          ...w.activePanelTabId,
          [sourcePanelId]: newSourceActiveId,
          [targetPanelId]: tabId,
        },
      };
    }));
  };

  const setMaximizedPanel = (workspaceId: string, panelId: string | null) => {
    setWorkspaces(prev => prev.map(w => w.id === workspaceId ? { ...w, maximizedPanelId: panelId } : w));
  };

  const renameWorkspace = (id: string, name: string) => {
    setWorkspaces(prev => prev.map(w => w.id === id ? { ...w, name } : w));
  };

  /** @deprecated Use addPanelTab instead */
  const updateWidgetMap = (workspaceId: string, panelId: string, widgetId: string) => {
    const label = widgetId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    addPanelTab(workspaceId, panelId, widgetId, label);
  };

  return {
    workspaces,
    activeWorkspace,
    activeWorkspaceId,
    setActiveWorkspaceId,
    addWorkspace,
    deleteWorkspace,
    duplicateWorkspace,
    updateWidgetMap,
    renameWorkspace,
    addPanelTab,
    removePanelTab,
    setActivePanelTab,
    updatePanelTab,
    reorderPanelTabs,
    moveTabToPanel,
    setMaximizedPanel,
    resetWorkspace: () => setActiveWorkspaceId(null),
  };
}
