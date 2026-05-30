'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  PiXBold, 
  PiPlusBold, 
  PiCaretRightBold, 
  PiSquaresFourBold, 
  PiCheckBold, 
  PiArrowsOutBold, 
  PiArrowsInBold,
  PiMagnifyingGlassBold
} from 'react-icons/pi';
import { Popover, Text, Input } from 'rizzui';
import cn from '@core/utils/class-names';
import { WIDGET_META } from './workspace-widgets';
import { 
  SortableContext, 
  horizontalListSortingStrategy, 
  useSortable, 
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface PanelTabBarProps {
  tabs: Array<{ id: string; widgetId: string; label: string; icon: React.ElementType }>;
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onAddTabWithWidget: (widgetId: string) => void;
  onTabReorder: (newIds: string[]) => void;
  /** Called when a tab from a different panel is dropped onto this panel's tab bar */
  onTabMove?: (tabId: string, sourcePanelId: string) => void;
  panelId: string;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  /** The panelId of the tab currently being dragged (from cross-panel drag) */
  draggingTabPanelId?: string | null;
}

function SortableTab({ 
  tab, 
  isActive, 
  onTabChange, 
  onTabClose, 
  showClose,
  panelId,
}: { 
  tab: { id: string; widgetId: string; label: string; icon: React.ElementType };
  isActive: boolean; 
  onTabChange: (id: string) => void; 
  onTabClose: (id: string) => void;
  showClose: boolean;
  panelId: string;
}) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({ 
    id: tab.id,
    data: {
      type: 'tab',
      tabId: tab.id,
      panelId,
      label: tab.label,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  const Icon = tab.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={() => onTabChange(tab.id)}
      className={cn(
        "group relative flex items-center gap-1.5 px-2 h-full text-[11px] font-medium cursor-pointer transition-colors border-r border-gray-100 select-none whitespace-nowrap min-w-[70px] max-w-[140px]",
        isActive ? "bg-white text-gray-800 font-semibold" : "bg-gray-50/30 text-gray-500 hover:bg-gray-50"
      )}
    >
      <div {...listeners} className="cursor-grab active:cursor-grabbing p-1 -ml-1">
        <Icon className={cn("h-3.5 w-3.5", isActive ? "text-[#3498db]" : "text-gray-400")} />
      </div>
      <span className="truncate">{tab.label}</span>
      
      {showClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTabClose(tab.id);
          }}
          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 pl-1"
        >
          <PiXBold className="h-2.5 w-2.5" />
        </button>
      )}
      
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3498db]" />
      )}
    </div>
  );
}


export default function PanelTabBar({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onAddTabWithWidget,
  onTabReorder,
  onTabMove,
  panelId,
  isMaximized,
  onToggleMaximize,
  draggingTabPanelId,
}: PanelTabBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(tabs.length);
  const [searchQuery, setSearchQuery] = useState('');

  // Droppable for cross-panel tab drops
  const { isOver, setNodeRef: setDropRef } = useDroppable({
    id: `tabbar-drop-${panelId}`,
    data: { type: 'tabbar', panelId },
    // Only activate as a drop target when a tab from a different panel is dragging
    disabled: !draggingTabPanelId || draggingTabPanelId === panelId,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    
    const calculateVisibleTabs = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const controlsWidth = 32 + 32 + (tabs.length > visibleCount ? 32 : 0);
      const available = container.clientWidth - controlsWidth;
      const count = Math.max(1, Math.floor(available / 100));
      setVisibleCount(count);
    };

    const observer = new ResizeObserver(() => calculateVisibleTabs());
    observer.observe(containerRef.current);
    calculateVisibleTabs();
    return () => observer.disconnect();
  }, [tabs.length, visibleCount]);

  const visibleTabs = tabs.slice(0, visibleCount);
  const hiddenTabs = tabs.slice(visibleCount);
  const isOverflowing = hiddenTabs.length > 0;

  const filteredWidgets = Object.entries(WIDGET_META).filter(([_, meta]) => 
    meta.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Whether a foreign tab is hovering this bar
  const showDropIndicator = isOver && draggingTabPanelId && draggingTabPanelId !== panelId;

  return (
    <div 
      ref={setDropRef}
      className={cn(
        "flex items-center h-8 bg-white border-b border-gray-100 w-full overflow-hidden shrink-0 relative transition-colors duration-150",
        showDropIndicator && "bg-blue-50/60"
      )}
    >
      {/* Drop indicator overlay */}
      {showDropIndicator && (
        <div className="absolute inset-0 border-2 border-[#3498db] border-dashed rounded-sm pointer-events-none z-10 flex items-center justify-center">
          <span className="text-[9px] font-bold text-[#3498db] uppercase tracking-wider bg-white px-1.5 rounded">
            Drop tab here
          </span>
        </div>
      )}

      <div 
        ref={containerRef}
        className="flex items-center h-full flex-grow overflow-hidden relative no-scrollbar"
      >
        <SortableContext 
          items={visibleTabs.map(t => t.id)} 
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex items-center h-full">
            {visibleTabs.map((tab) => (
              <SortableTab
                key={tab.id}
                tab={tab}
                panelId={panelId}
                isActive={tab.id === activeTabId}
                onTabChange={onTabChange}
                onTabClose={onTabClose}
                showClose={tabs.length > 1}
              />
            ))}
          </div>
        </SortableContext>
      </div>

      <div className="flex items-center h-full shrink-0 bg-white z-10 shadow-[-10px_0_10px_-5px_rgba(0,0,0,0.02)]">
        {isOverflowing && (
          <Popover placement="bottom-end">
            <Popover.Trigger>
              <button className="px-2 h-full border-l border-gray-100 text-gray-400 hover:text-[#3498db] transition-colors flex items-center gap-0.5">
                <PiCaretRightBold className="h-3 w-3" />
                <span className="text-[9px] font-bold">{hiddenTabs.length}</span>
              </button>
            </Popover.Trigger>
            <Popover.Content className="z-[1100] p-1 w-48 rounded-lg shadow-xl border border-gray-100 bg-white">
              {hiddenTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-1.5 text-left text-[11px] font-medium rounded hover:bg-blue-50 hover:text-[#3498db] transition-colors",
                    tab.id === activeTabId && "text-[#3498db] bg-blue-50/50"
                  )}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  <span className="truncate flex-grow">{tab.label}</span>
                  {tab.id === activeTabId && <PiCheckBold className="h-3 w-3" />}
                </button>
              ))}
            </Popover.Content>
          </Popover>
        )}
        
        <button
          onClick={onToggleMaximize}
          className="px-2 h-full border-l border-gray-100 text-gray-400 hover:text-[#3498db] transition-colors flex items-center"
          title={isMaximized ? "Exit Maximize" : "Maximize"}
        >
          {isMaximized ? <PiArrowsInBold className="h-3.5 w-3.5" /> : <PiArrowsOutBold className="h-3.5 w-3.5" />}
        </button>

        <Popover placement="bottom-end">
          <Popover.Trigger>
            <button
              title="Add Tab"
              className="px-2 h-full border-l border-gray-100 text-gray-400 hover:text-[#3498db] transition-all flex items-center"
            >
              <PiPlusBold className="h-3.5 w-3.5" />
            </button>
          </Popover.Trigger>
          <Popover.Content className="z-[1100] p-0 w-56 rounded-xl shadow-2xl border border-gray-100 overflow-hidden bg-white">
            <div className="px-3 py-2 border-b border-gray-50 bg-gray-50/50">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Add Widget Tab
              </Text>
            </div>
            <div className="p-2 border-b border-gray-50 bg-white">
              <Input
                size="sm"
                variant="flat"
                placeholder="Search widgets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<PiMagnifyingGlassBold className="h-3.5 w-3.5 text-gray-400" />}
                className="[&_input]:text-[11px] [&_input]:h-8"
              />
            </div>
            <div className="p-1 max-h-[300px] overflow-y-auto custom-scrollbar">
              {filteredWidgets.length > 0 ? (
                filteredWidgets.map(([key, meta]) => {
                  const Icon = meta.icon ?? PiSquaresFourBold;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        onAddTabWithWidget(key);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-xs font-semibold rounded-lg transition-colors hover:bg-blue-50 hover:text-[#3498db]"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{meta.label}</span>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center">
                  <Text className="text-[10px] text-gray-400">No widgets found</Text>
                </div>
              )}
            </div>
          </Popover.Content>
        </Popover>
      </div>
    </div>
  );
}
