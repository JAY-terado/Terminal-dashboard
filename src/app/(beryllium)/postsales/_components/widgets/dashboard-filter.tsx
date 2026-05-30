'use client';

import { useState } from 'react';
import cn from '@core/utils/class-names';

const filters = [
  'OVERALL',
  'TODAY',
  'YESTERDAY',
  'THIS WEEK',
  'THIS MONTH',
  'QUARTER',
  'THIS YEAR',
];

export default function DashboardFilter({ className }: { className?: string }) {
  const [active, setActive] = useState('OVERALL');

  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar', className)}>
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActive(filter)}
          className={cn(
            'whitespace-nowrap rounded-full px-6 py-2.5 text-[10px] font-bold tracking-widest transition-all duration-200 border',
            active === filter
              ? 'bg-[#3498db] text-white border-[#3498db] shadow-md'
              : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
