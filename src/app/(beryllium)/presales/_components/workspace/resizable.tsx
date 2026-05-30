'use client';

import React, { useState, createContext, useContext } from 'react';
import { 
  Group, 
  Panel, 
  Separator, 
  type GroupProps, 
  type PanelProps,
  type SeparatorProps 
} from 'react-resizable-panels';
import { PiDotsSixVerticalBold } from 'react-icons/pi';
import cn from '@core/utils/class-names';
import { useDroppable } from '@dnd-kit/core';

const ResizeContext = createContext(false);

interface ResizablePanelGroupProps extends Omit<GroupProps, 'orientation'> {
  direction?: 'horizontal' | 'vertical';
  autoSaveId?: string;
}

const ResizablePanelGroup = ({
  className,
  direction = 'horizontal',
  autoSaveId,
  isDropTarget, // Prevent prop bleeding to DOM
  ...props
}: ResizablePanelGroupProps & { isDropTarget?: boolean }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [defaultLayout, setDefaultLayout] = useState<Record<string, number> | undefined>(() => {
    if (typeof window !== 'undefined' && autoSaveId) {
      const saved = localStorage.getItem(`resizable-layout:${autoSaveId}`);
      if (saved) {
        try {
          return JSON.parse(saved) as Record<string, number>;
        } catch (e) {
          return undefined;
        }
      }
    }
    return undefined;
  });

  const onLayoutChange = (layout: Record<string, number>) => {
    if (autoSaveId) {
      localStorage.setItem(`resizable-layout:${autoSaveId}`, JSON.stringify(layout));
    }
  };

  return (
    <ResizeContext.Provider value={isResizing}>
      <Group
        orientation={direction}
        className={cn(
          'h-full w-full',
          className
        )}
        defaultLayout={defaultLayout}
        onLayoutChange={onLayoutChange}
        onDragStart={() => setIsResizing(true)}
        onDragEnd={() => setIsResizing(false)}
        {...props}
      />
    </ResizeContext.Provider>
  );
};

const ResizablePanel = ({ 
  children, 
  id, 
  ...props 
}: PanelProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: String(id) || 'default-panel',
  });
  const isResizing = useContext(ResizeContext);

  return (
    <Panel id={id} {...props}>
      <div 
        ref={setNodeRef} 
        className={cn(
          "h-full w-full flex flex-col p-1 bg-gray-50/30 transition-all duration-200",
          isResizing && "ring-1 ring-[#3498db]/20 transition-none",
          isOver && "ring-4 ring-[#3498db] ring-inset bg-blue-50/20"
        )}
      >
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, { isDropTarget: isOver })
            : child
        )}
      </div>
    </Panel>
  );
};

const ResizableHandle = ({
  className,
  withHandle, // Prevent prop bleeding to DOM
  ...props
}: SeparatorProps & { withHandle?: boolean }) => (
  <Separator
    className={cn(
      'relative flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3498db] group',
      'data-[panel-group-direction=vertical]:h-1 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:cursor-row-resize data-[panel-group-direction=vertical]:bg-gradient-to-b data-[panel-group-direction=vertical]:from-gray-50 data-[panel-group-direction=vertical]:via-gray-200 data-[panel-group-direction=vertical]:to-gray-50 data-[panel-group-direction=vertical]:hover:from-blue-50 data-[panel-group-direction=vertical]:hover:via-[#3498db]/40 data-[panel-group-direction=vertical]:hover:to-blue-50',
      'data-[panel-group-direction=horizontal]:w-1 data-[panel-group-direction=horizontal]:h-full data-[panel-group-direction=horizontal]:cursor-col-resize data-[panel-group-direction=horizontal]:bg-gradient-to-r data-[panel-group-direction=horizontal]:from-gray-50 data-[panel-group-direction=horizontal]:via-gray-200 data-[panel-group-direction=horizontal]:to-gray-50 data-[panel-group-direction=horizontal]:hover:from-blue-50 data-[panel-group-direction=horizontal]:hover:via-[#3498db]/40 data-[panel-group-direction=horizontal]:hover:to-blue-50',
      'data-[resize-handle-state=drag]:bg-[#3498db]/20',
      className
    )}
    {...props}
  >
    <div className={cn(
      "grip-pill absolute inset-0 m-auto flex items-center justify-center bg-white rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.12)] transition-all duration-150 group-hover:scale-110",
      "data-[panel-group-direction=vertical]:h-1 data-[panel-group-direction=vertical]:w-8",
      "data-[panel-group-direction=horizontal]:w-1 data-[panel-group-direction=horizontal]:h-8",
      "group-data-[resize-handle-state=drag]:bg-[#3498db]/80 group-data-[resize-handle-state=drag]:scale-125"
    )}>
      <div className="flex gap-0.5 group-data-[panel-group-direction=vertical]:flex-row group-data-[panel-group-direction=horizontal]:flex-col">
        <div className="w-0.5 h-0.5 rounded-full bg-gray-300 group-hover:bg-[#3498db]/60 transition-colors" />
        <div className="w-0.5 h-0.5 rounded-full bg-gray-300 group-hover:bg-[#3498db]/60 transition-colors" />
        <div className="w-0.5 h-0.5 rounded-full bg-gray-300 group-hover:bg-[#3498db]/60 transition-colors" />
      </div>
    </div>
  </Separator>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
