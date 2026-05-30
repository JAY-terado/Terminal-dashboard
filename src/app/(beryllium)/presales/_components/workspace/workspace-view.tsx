'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from './resizable';
import { WorkspaceWidget } from './workspace-widgets';
import { Button, Popover, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  DragOverlay, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  closestCenter,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useWorkspaces } from './workspace-atoms';
import { 
  PiPlusBold, 
  PiXBold, 
  PiSquaresFourBold, 
  PiDotsSixVerticalBold, 
  PiCopyBold, 
  PiCaretRightBold, 
  PiCheckBold 
} from 'react-icons/pi';
import { motion, AnimatePresence } from 'motion/react'

interface WorkspaceViewProps {
  layoutId: string;
  onClose: () => void;
  onAddWorkspace: () => void;
}

const ALL_WIDGETS = [
  { id: 'total-leads', name: 'Total Leads' },
  { id: 'by-region', name: 'Region Chart' },
  { id: 'by-status', name: 'Status Breakdown' },
  { id: 'my-team', name: 'Team Performance' },
  { id: 'payment-terms', name: 'Payment Terms' },
  { id: 'booking-info', name: 'Booking Details' },
  { id: 'inv-matrix', name: 'Inventory Matrix' },
  { id: 'pay-details', name: 'Payment Details' },
];

const LAYOUT_ICONS: Record<string, React.ReactNode> = {
  trade: (
    <svg viewBox="0 0 16 10" className="w-4 h-2.5 shrink-0">
      <rect x="0" y="0" width="7" height="10" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="8" y="0" width="8" height="4.5" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="8" y="5.5" width="3.5" height="4.5" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="12.5" y="5.5" width="3.5" height="4.5" rx="1" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  simple: (
    <svg viewBox="0 0 16 10" className="w-4 h-2.5 shrink-0">
      <rect x="0" y="0" width="7" height="10" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="9" y="0" width="7" height="10" rx="1" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 16 10" className="w-4 h-2.5 shrink-0">
      <rect x="0" y="0" width="7" height="4.5" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="9" y="0" width="7" height="4.5" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="0" y="5.5" width="7" height="4.5" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="9" y="5.5" width="7" height="4.5" rx="1" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  scalper: (
    <svg viewBox="0 0 16 10" className="w-4 h-2.5 shrink-0">
      <rect x="0" y="0" width="9" height="4.5" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="0" y="5.5" width="9" height="4.5" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="11" y="0" width="5" height="10" rx="1" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  invest: (
    <svg viewBox="0 0 16 10" className="w-4 h-2.5 shrink-0">
      <rect x="0" y="0" width="16" height="5" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="0" y="6" width="4.5" height="4" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="5.75" y="6" width="4.5" height="4" rx="1" fill="currentColor" opacity="0.4"/>
      <rect x="11.5" y="6" width="4.5" height="4" rx="1" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  blank: (
    <svg viewBox="0 0 16 10" className="w-4 h-2.5 shrink-0">
      <rect x="0" y="0" width="16" height="10" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="0.5"/>
    </svg>
  ),
};

export default function WorkspaceView({ layoutId: initialLayoutId, onClose, onAddWorkspace }: WorkspaceViewProps) {
  const { 
    workspaces, 
    activeWorkspace, 
    activeWorkspaceId,
    updateWidgetMap,
    setActiveWorkspaceId,
    deleteWorkspace,
    duplicateWorkspace,
    renameWorkspace,
    addPanelTab,
    removePanelTab,
    setActivePanelTab,
    updatePanelTab,
    reorderPanelTabs,
    moveTabToPanel,
    setMaximizedPanel
  } = useWorkspaces();
  
  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);
  const [draggedWidgetTitle, setDraggedWidgetTitle] = useState<string>('');
  /** panelId of the tab being cross-panel dragged, or null */
  const [draggingTabPanelId, setDraggingTabPanelId] = useState<string | null>(null);
  /** label / icon of the tab ghost shown in DragOverlay */
  const [draggingTabLabel, setDraggingTabLabel] = useState<string>('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [visibleCount, setVisibleCount] = useState(workspaces.length);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleWheel = (e: React.WheelEvent) => {
    if (tabBarRef.current) {
      tabBarRef.current.scrollLeft += e.deltaY;
    }
  };

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      setSavedAt(new Date());
    }
  }, [activeWorkspace.panelTabs, activeWorkspace.activePanelTabId, activeWorkspace.name, hasMounted]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeWorkspace.maximizedPanelId) {
          setMaximizedPanel(activeWorkspace.id, null);
        } else {
          onClose();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key) - 1;
        if (workspaces[idx]) setActiveWorkspaceId(workspaces[idx].id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [workspaces, onClose, setActiveWorkspaceId, activeWorkspace, setMaximizedPanel]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const calculateVisibleTabs = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const containerWidth = container.clientWidth;
      // Approximate tab width + gap (140px is a safe estimate for labeled tabs)
      const count = Math.max(1, Math.floor(containerWidth / 140));
      setVisibleCount(count);
    };

    const observer = new ResizeObserver(() => calculateVisibleTabs());
    observer.observe(containerRef.current);
    calculateVisibleTabs();
    return () => observer.disconnect();
  }, [workspaces.length]);

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.type === 'tab') {
      // Cross-panel tab drag — mark panelId so other bars can show drop zones
      setDraggingTabPanelId(data.panelId as string);
      setDraggingTabLabel(data.label as string ?? '');
    } else {
      // Widget drag (legacy)
      const widgetId = data?.widgetId as string;
      setDraggedWidgetId(widgetId);
      setDraggedWidgetTitle(ALL_WIDGETS.find(w => w.id === widgetId)?.name || 'Widget');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeData = active.data.current;

    if (activeData?.type === 'tab') {
      const sourcePanelId = activeData.panelId as string;
      const tabId = activeData.tabId as string;

      if (over) {
        const overData = over.data.current;

        if (overData?.type === 'tabbar') {
          // Dropped onto a foreign panel's tab bar drop zone
          const targetPanelId = overData.panelId as string;
          if (targetPanelId !== sourcePanelId) {
            moveTabToPanel(activeWorkspace.id, tabId, sourcePanelId, targetPanelId);
          }
        } else if (overData?.type === 'tab') {
          // Dropped onto another tab
          const targetPanelId = overData.panelId as string;
          if (targetPanelId === sourcePanelId) {
            // Same panel – reorder
            const tabs = activeWorkspace.panelTabs[sourcePanelId] || [];
            const oldIndex = tabs.findIndex(t => t.id === tabId);
            const newIndex = tabs.findIndex(t => t.id === over.id);
            if (oldIndex !== newIndex) {
              const newTabs = arrayMove(tabs, oldIndex, newIndex);
              reorderPanelTabs(activeWorkspace.id, sourcePanelId, newTabs.map(t => t.id));
            }
          } else {
            // Different panel – move
            const targetTabs = activeWorkspace.panelTabs[targetPanelId] || [];
            const targetIndex = targetTabs.findIndex(t => t.id === over.id);
            moveTabToPanel(activeWorkspace.id, tabId, sourcePanelId, targetPanelId, targetIndex >= 0 ? targetIndex : undefined);
          }
        }
      }
    } else {
      // Widget drag
      if (over && activeData) {
        const widgetId = activeData.widgetId as string;
        const panelId = over.id as string;
        updateWidgetMap(activeWorkspace.id, panelId, widgetId);
      }
    }

    setDraggingTabPanelId(null);
    setDraggingTabLabel('');
    setDraggedWidgetId(null);
  };

  const getWidgetProps = (panelId: string) => {
    return {
      panelId,
      workspaceId: activeWorkspace.id,
      tabs: activeWorkspace?.panelTabs?.[panelId] || [],
      activeTabId: activeWorkspace?.activePanelTabId?.[panelId] || '',
      draggingTabPanelId,
      onTabChange: (tabId: string) => setActivePanelTab(activeWorkspace.id, panelId, tabId),
      onTabClose: (tabId: string) => removePanelTab(activeWorkspace.id, panelId, tabId),
      onTabReorder: (newIds: string[]) => reorderPanelTabs(activeWorkspace.id, panelId, newIds),
      onTabMove: (tabId: string, sourcePanelId: string) =>
        moveTabToPanel(activeWorkspace.id, tabId, sourcePanelId, panelId),
      onAddTab: (widgetId: string) => {
        const label = ALL_WIDGETS.find(w => w.id === widgetId)?.name || 'Widget';
        addPanelTab(activeWorkspace.id, panelId, widgetId, label);
      },
      isMaximized: activeWorkspace.maximizedPanelId === panelId,
      onToggleMaximize: () => setMaximizedPanel(activeWorkspace.id, activeWorkspace.maximizedPanelId === panelId ? null : panelId)
    };
  };

  const visibleWorkspaces = workspaces.slice(0, visibleCount);
  const hiddenWorkspaces = workspaces.slice(visibleCount);
  const isOverflowing = hiddenWorkspaces.length > 0;

  const renderLayout = () => {
    const maximizedPanelId = activeWorkspace.maximizedPanelId;
    
    if (maximizedPanelId) {
      return (
        <div className="h-full w-full">
          <WorkspaceWidget {...getWidgetProps(maximizedPanelId)} />
        </div>
      );
    }

    switch (activeWorkspace.layoutId) {
      case 'trade':
        return (
          <ResizablePanelGroup direction="horizontal" autoSaveId={`ws-${activeWorkspace.layoutId}-root`}>
            <ResizablePanel id="p1" defaultSize={60} minSize={30}>
              <WorkspaceWidget {...getWidgetProps('p1')} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={30}>
              <ResizablePanelGroup direction="vertical" autoSaveId={`ws-${activeWorkspace.layoutId}-nested-1`}>
                <ResizablePanel id="p2" defaultSize={50} minSize={20}>
                  <WorkspaceWidget {...getWidgetProps('p2')} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={20}>
                  <ResizablePanelGroup direction="horizontal" autoSaveId={`ws-${activeWorkspace.layoutId}-nested-2`}>
                    <ResizablePanel id="p3" defaultSize={50}>
                      <WorkspaceWidget {...getWidgetProps('p3')} />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel id="p4" defaultSize={50}>
                      <WorkspaceWidget {...getWidgetProps('p4')} />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        );

      case 'invest':
        return (
          <ResizablePanelGroup direction="vertical" autoSaveId={`ws-${activeWorkspace.layoutId}-root`}>
            <ResizablePanel id="p1" defaultSize={60}>
              <WorkspaceWidget {...getWidgetProps('p1')} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40}>
              <ResizablePanelGroup direction="horizontal" autoSaveId={`ws-${activeWorkspace.layoutId}-nested-1`}>
                <ResizablePanel id="p2" defaultSize={33}>
                  <WorkspaceWidget {...getWidgetProps('p2')} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel id="p3" defaultSize={33}>
                  <WorkspaceWidget {...getWidgetProps('p3')} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel id="p4" defaultSize={34}>
                  <WorkspaceWidget {...getWidgetProps('p4')} />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        );

      case 'scalper':
        return (
          <ResizablePanelGroup direction="horizontal" autoSaveId={`ws-${activeWorkspace.layoutId}-root`}>
            <ResizablePanel id="p-inner-panel" defaultSize={65}>
              <ResizablePanelGroup direction="vertical" autoSaveId={`ws-${activeWorkspace.layoutId}-nested-1`}>
                <ResizablePanel id="p1" defaultSize={50}>
                  <WorkspaceWidget {...getWidgetProps('p1')} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel id="p2" defaultSize={50}>
                  <WorkspaceWidget {...getWidgetProps('p2')} />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel id="p3" defaultSize={35}>
              <WorkspaceWidget {...getWidgetProps('p3')} />
            </ResizablePanel>
          </ResizablePanelGroup>
        );

      case 'simple':
        return (
          <ResizablePanelGroup direction="horizontal" autoSaveId={`ws-${activeWorkspace.layoutId}-root`}>
            <ResizablePanel id="p1" defaultSize={50}>
              <WorkspaceWidget {...getWidgetProps('p1')} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel id="p2" defaultSize={50}>
              <WorkspaceWidget {...getWidgetProps('p2')} />
            </ResizablePanel>
          </ResizablePanelGroup>
        );

      case 'grid':
        return (
          <ResizablePanelGroup direction="vertical" autoSaveId={`ws-${activeWorkspace.layoutId}-root`}>
            <ResizablePanel defaultSize={50}>
              <ResizablePanelGroup direction="horizontal" autoSaveId={`ws-${activeWorkspace.layoutId}-nested-1`}>
                <ResizablePanel id="p1" defaultSize={50}>
                  <WorkspaceWidget {...getWidgetProps('p1')} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel id="p2" defaultSize={50}>
                  <WorkspaceWidget {...getWidgetProps('p2')} />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <ResizablePanelGroup direction="horizontal" autoSaveId={`ws-${activeWorkspace.layoutId}-nested-2`}>
                <ResizablePanel id="p3" defaultSize={50}>
                  <WorkspaceWidget {...getWidgetProps('p3')} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel id="p4" defaultSize={50}>
                  <WorkspaceWidget {...getWidgetProps('p4')} />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        );
      default:
        return (
          <ResizablePanelGroup direction="horizontal" autoSaveId={`ws-${activeWorkspace.layoutId}-root`}>
            <ResizablePanel id="p1">
              <WorkspaceWidget {...getWidgetProps('p1')} />
            </ResizablePanel>
          </ResizablePanelGroup>
        );
    }
  };

  if (!hasMounted) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-gray-50 flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm relative z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#3498db] flex items-center justify-center shadow-md">
              <PiSquaresFourBold className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 uppercase tracking-widest text-sm shrink-0">
                Terminal Mode
              </span>
              {savedAt && (
                <span 
                  suppressHydrationWarning
                  className="text-[10px] text-green-600/70 font-mono flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/70 inline-block" />
                  saved {savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-50 text-[#3498db] border border-[#3498db]/20">
              {activeWorkspace.layoutId}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-grow max-w-[750px] overflow-hidden">
            <div ref={containerRef} className="relative flex-grow overflow-hidden">
              <div 
                ref={tabBarRef}
                onWheel={handleWheel}
                className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth"
              >
                {visibleWorkspaces.map((ws) => (
                  <div
                    key={ws.id}
                    className={cn(
                      "flex items-center gap-2 px-4 py-1.5 rounded-t-lg cursor-pointer transition-all border-b-2 whitespace-nowrap group",
                      ws.id === activeWorkspace.id 
                        ? "text-[#3498db] border-[#3498db] font-bold bg-blue-50/50" 
                        : "text-gray-500 border-transparent hover:bg-gray-50"
                    )}
                    onClick={() => setActiveWorkspaceId(ws.id)}
                  >
                    <span className={ws.id === activeWorkspace.id ? "text-[#3498db]" : "text-gray-500"}>
                      {LAYOUT_ICONS[ws.layoutId] ?? LAYOUT_ICONS.blank}
                    </span>
                    {renamingId === ws.id ? (
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onBlur={() => {
                          if (renameValue.trim()) renameWorkspace(ws.id, renameValue.trim());
                          setRenamingId(null);
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            if (renameValue.trim()) renameWorkspace(ws.id, renameValue.trim());
                            setRenamingId(null);
                          }
                          if (e.key === 'Escape') setRenamingId(null);
                        }}
                        className="bg-transparent border-b border-[#3498db] outline-none text-[#3498db] text-xs font-bold w-24"
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setRenamingId(ws.id);
                          setRenameValue(ws.name);
                        }}
                      >{ws.name}</span>
                    )}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateWorkspace(ws.id);
                        }}
                        className="p-0.5 rounded-full hover:bg-blue-100/20 hover:text-[#3498db]"
                        title="Duplicate workspace"
                      >
                        <PiCopyBold className="h-3 w-3" />
                      </button>
                      {workspaces.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteWorkspace(ws.id);
                          }}
                          className="p-0.5 rounded-full hover:bg-red-100 hover:text-red-500"
                        >
                          <PiXBold className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {isOverflowing && (
                <Popover placement="bottom-end">
                  <Popover.Trigger>
                    <button className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-gray-400 hover:text-[#3498db] hover:bg-blue-50 rounded-lg border border-gray-200 transition-all">
                      <PiCaretRightBold className="h-3.5 w-3.5" />
                      {hiddenWorkspaces.length}
                    </button>
                  </Popover.Trigger>
                  <Popover.Content className="z-[1100] p-1.5 w-56 rounded-xl shadow-2xl border border-gray-100 bg-white">
                    <div className="px-3 py-2 border-b border-gray-50 mb-1">
                      <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Other Workspaces
                      </Text>
                    </div>
                    {hiddenWorkspaces.map((ws) => (
                      <button
                        key={ws.id}
                        onClick={() => setActiveWorkspaceId(ws.id)}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 text-left text-[11px] font-semibold rounded-lg transition-all",
                          ws.id === activeWorkspace.id 
                            ? "bg-blue-50 text-[#3498db]" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <span className="shrink-0">{LAYOUT_ICONS[ws.layoutId] ?? LAYOUT_ICONS.blank}</span>
                        <span className="truncate flex-grow">{ws.name}</span>
                        {ws.id === activeWorkspace.id && <PiCheckBold className="h-3 w-3" />}
                      </button>
                    ))}
                  </Popover.Content>
                </Popover>
              )}

              <button
                onClick={onAddWorkspace}
                className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-gray-400 hover:text-[#3498db] hover:bg-blue-50 rounded-lg border border-dashed border-gray-200 hover:border-[#3498db] transition-all whitespace-nowrap"
              >
                <PiPlusBold className="h-3.5 w-3.5" />
                New
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded border border-gray-200 text-gray-400 font-mono">Esc</kbd>
          <Button 
            variant="text" 
            onClick={onClose}
            className="hover:bg-red-50 hover:text-red-500 rounded-xl font-bold transition-all"
          >
            <PiXBold className="h-5 w-5 mr-2" />
            Exit Terminal
          </Button>
        </div>
      </div>
      
      <div className="flex-grow flex overflow-hidden">
        <div className="flex-grow p-2 bg-gray-100/50">
          <div className="h-full w-full rounded-2xl overflow-hidden border border-gray-200 shadow-2xl bg-white ring-1 ring-black/5">
          <DndContext 
            sensors={sensors}
            collisionDetection={draggingTabPanelId ? closestCenter : closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {renderLayout()}
            <DragOverlay dropAnimation={null}>
              {draggingTabPanelId ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3498db] text-white text-[11px] font-bold rounded-lg shadow-2xl opacity-95 cursor-grabbing">
                  <PiDotsSixVerticalBold className="h-3.5 w-3.5" />
                  <span>{draggingTabLabel || 'Tab'}</span>
                </div>
              ) : draggedWidgetId ? (
                <div className="px-4 py-2 bg-[#3498db] text-white text-xs font-bold rounded-xl shadow-2xl opacity-90 flex items-center gap-2 cursor-grabbing">
                  <PiDotsSixVerticalBold className="h-4 w-4" />
                  {draggedWidgetTitle}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}
