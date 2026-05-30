'use client';

import React from 'react';
import { Title, Text, ActionIcon, Button, Popover } from 'rizzui';
import cn from '@core/utils/class-names';
import { useDraggable } from '@dnd-kit/core';
import { 
  PiDotsSixVerticalBold, 
  PiGearSixBold, 
  PiTrashBold,
  PiPlusBold,
  PiSquaresFourBold,
  PiChartBarBold, 
  PiMapPinBold, 
  PiChartPieBold, 
  PiUsersBold,
  PiCheckBold,
  PiCheckCircleBold,
  PiBookOpenBold,
  PiTableBold,
  PiCreditCardBold
} from 'react-icons/pi';
import TotalLeads from '../widgets/total-leads';
import ByRegion from '../widgets/by-region';
import ByStatus from '../widgets/by-status';
import MyTeam from '../widgets/my-team';

// Post-Sales Widgets
import ActivePaymentTerms from '../../../postsales/_components/widgets/active-payment-terms';
import BookingDetails from '../../../postsales/_components/widgets/booking-details';
import InventoryMatrix from '../../../postsales/_components/widgets/inventory-matrix';
import PaymentDetails from '../../../postsales/_components/widgets/payment-details';

import PanelTabBar from './panel-tab-bar';
import { PanelTab } from './workspace-atoms';

export const WIDGET_META: Record<string, { icon: React.ElementType; label: string }> = {
  // Pre-Sales
  'total-leads':    { icon: PiChartBarBold,       label: 'Total Leads'       },
  'by-region':      { icon: PiMapPinBold,          label: 'Region Chart'      },
  'by-status':      { icon: PiChartPieBold,        label: 'Status Breakdown'  },
  'my-team':        { icon: PiUsersBold,           label: 'Team Performance'  },
  // Post-Sales
  'payment-terms':  { icon: PiCheckCircleBold,     label: 'Payment Terms'     },
  'booking-info':   { icon: PiBookOpenBold,        label: 'Booking Details'   },
  'inv-matrix':     { icon: PiTableBold,           label: 'Inventory Matrix'  },
  'pay-details':    { icon: PiCreditCardBold,      label: 'Payment Details'   },
};

export const WIDGET_COMPONENTS: Record<string, React.FC<any>> = {
  'total-leads':    TotalLeads,
  'by-region':      ByRegion,
  'by-status':      ByStatus,
  'my-team':        MyTeam,
  'payment-terms':  ActivePaymentTerms,
  'booking-info':   BookingDetails,
  'inv-matrix':     InventoryMatrix,
  'pay-details':    PaymentDetails,
};

export interface WorkspaceWidgetProps {
  panelId: string;
  workspaceId: string;
  tabs: PanelTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onAddTab: (widgetId: string) => void;
  onTabReorder: (newIds: string[]) => void;
  /** Called when a tab from another panel is dropped onto this panel */
  onTabMove?: (tabId: string, sourcePanelId: string) => void;
  /** The panelId of the tab currently being dragged (cross-panel drag state) */
  draggingTabPanelId?: string | null;
  isDropTarget?: boolean;
  className?: string;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
}

import { motion, AnimatePresence } from 'motion/react';

export function WorkspaceWidget({ 
  panelId,
  workspaceId,
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onAddTab,
  onTabReorder,
  onTabMove,
  draggingTabPanelId,
  isDropTarget,
  className,
  isMaximized,
  onToggleMaximize,
}: WorkspaceWidgetProps) {
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: `draggable-widget-${panelId}`,
    data: { panelId, widgetId: activeTab?.widgetId },
    disabled: tabs.length === 0 || isMaximized
  });

  const Component = activeTab ? WIDGET_COMPONENTS[activeTab.widgetId] : null;

  return (
    <div className={cn('h-full w-full flex flex-col bg-white overflow-hidden rounded-xl shadow-sm border border-gray-200 group/widget transition-opacity', isDragging && "opacity-50", className)}>
      <div className="relative">
        <PanelTabBar
          tabs={tabs.map(t => ({
            ...t,
            icon: WIDGET_META[t.widgetId]?.icon || PiSquaresFourBold
          }))}
          activeTabId={activeTabId}
          onTabChange={onTabChange}
          onTabClose={onTabClose}
          onAddTabWithWidget={onAddTab}
          onTabReorder={onTabReorder}
          onTabMove={onTabMove}
          draggingTabPanelId={draggingTabPanelId}
          panelId={panelId}
          isMaximized={isMaximized}
          onToggleMaximize={onToggleMaximize}
        />
        {!isMaximized && (
          <div 
            ref={setDragRef}
            {...listeners}
            {...attributes}
            className="absolute left-0 top-0 bottom-0 w-1 cursor-grab active:cursor-grabbing hover:bg-[#3498db] transition-colors z-20"
          />
        )}
      </div>

      <div className="flex-grow relative overflow-hidden">
        <div
          key={activeTab?.id ?? 'empty'}
          className="absolute inset-0 overflow-y-auto custom-scrollbar p-2"
        >
          {Component ? (
            <Component hideHeader={true} className="!p-0 !shadow-none !border-none" />
          ) : (
            <div 
              onClick={() => onAddTab(Object.keys(WIDGET_COMPONENTS)[0])}
              className={cn(
                "h-full w-full flex flex-col items-center justify-center text-center border-2 border-dashed border-[#3498db]/20 rounded-xl bg-gray-50/30 cursor-pointer transition-all hover:bg-blue-50/50 hover:border-[#3498db]/40",
                isDropTarget && "border-[#3498db] border-solid bg-blue-50/30 scale-[0.98]"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm transition-colors",
                isDropTarget ? "text-[#3498db]" : "text-gray-300"
              )}>
                <PiSquaresFourBold className="h-5 w-5" />
              </div>
              <Text className={cn(
                "text-[10px] font-bold uppercase tracking-widest leading-relaxed transition-colors",
                isDropTarget ? "text-[#3498db]" : "text-gray-400"
              )}>
                {isDropTarget ? "Drop to assign" : <>Drop widget here<br/>or click + to choose</>}
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
