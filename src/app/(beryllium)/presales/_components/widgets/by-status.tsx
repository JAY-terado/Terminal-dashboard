'use client';

import { Title, Text, Button } from 'rizzui';
import cn from '@core/utils/class-names';

const statusData = [
  { name: 'New', count: 93 },
  { name: 'Schedule Site Visit', count: 45 },
  { name: 'Followup', count: 362 },
  { name: 'Site Visit Done', count: 28 },
  { name: 'Negotiation', count: 12 },
  { name: 'Closed', count: 5 },
  { name: 'Lost', count: 18 },
  { name: 'Interested', count: 55 },
];

export default function ByStatus({ 
  className,
  hideHeader = false 
}: { 
  className?: string;
  hideHeader?: boolean;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {!hideHeader && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-[#3498db] rounded-full" />
            <Title as="h3" className="text-lg font-bold text-gray-800">
              By Status
            </Title>
          </div>
          <Button variant="text" className="text-[#3498db] font-semibold text-sm">
            View More
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 @sm:grid-cols-4">
        {statusData.map((item) => (
          <div
            key={item.name}
            className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-sm border border-gray-100 transition-shadow hover:shadow-md"
          >
            <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              {item.name}
            </Text>
            <Text className="text-xl font-extrabold text-gray-900">
              {item.count}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
