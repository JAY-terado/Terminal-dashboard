"use client";

import { useState } from 'react';
import { Text, Button } from 'rizzui';
import { PiPlusBold, PiCalendarBold } from 'react-icons/pi';
import TotalLeads from '../_components/widgets/total-leads';
import ByRegion from '../_components/widgets/by-region';
import ByStatus from '../_components/widgets/by-status';
import MyTeam from '../_components/widgets/my-team';
import { DatePicker } from '@core/ui/datepicker';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { useWorkspaces } from '../_components/workspace/workspace-atoms';
import WorkspaceLayoutSelector from '../_components/workspace/workspace-layout-selector';

export default function DashboardContent() {
  const [startDate, setStartDate] = useState<Date | null>(new Date('2026-04-01'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2026-04-30'));
  const { activeWorkspace, setActiveWorkspaceId } = useWorkspaces();
  const { openModal } = useModal();

  return (
    <div className="space-y-8 pb-10 @container">
      {/* Date Selectors - The "Welcome" and "Tabs" sections have been removed as requested */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
          <div className="flex-grow">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Start Date</Text>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              placeholderText="Select Start Date"
              dateFormat="dd MMM, yyyy"
              inputProps={{
                variant: 'text',
                inputClassName: 'p-0 h-auto font-bold text-gray-700 focus:ring-0 w-full',
              }}
            />
          </div>
          <PiCalendarBold className="h-5 w-5 text-gray-400" />
        </div>
        <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
          <div className="flex-grow">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">End Date</Text>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              placeholderText="Select End Date"
              dateFormat="dd MMM, yyyy"
              inputProps={{
                variant: 'text',
                inputClassName: 'p-0 h-auto font-bold text-gray-700 focus:ring-0 w-full',
              }}
            />
          </div>
          <PiCalendarBold className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <TotalLeads key={`leads-${startDate?.getTime()}-${endDate?.getTime()}`} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ByRegion key={`region-${startDate?.getTime()}-${endDate?.getTime()}`} />
        <ByStatus key={`status-${startDate?.getTime()}-${endDate?.getTime()}`} />
      </div>

      <div className="space-y-6">
        <MyTeam key={`team-${startDate?.getTime()}-${endDate?.getTime()}`} />
        <div className="flex justify-center gap-4">
          <Button className="bg-white text-gray-700 border border-gray-200 rounded-2xl h-12 px-8 shadow-sm hover:bg-gray-50 transition-all">
            <PiPlusBold className="me-2 h-5 w-5" />
            Add New Lead
          </Button>
        </div>
      </div>
    </div>
  );
}
