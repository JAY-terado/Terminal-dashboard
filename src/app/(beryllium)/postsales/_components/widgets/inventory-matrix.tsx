'use client';

import { Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';

const inventoryData = [
  {
    title: 'Wing A',
    sold: 35,
    blocked: 14,
    unsold: 106,
  },
  {
    title: 'Wing B',
    sold: 38,
    blocked: 8,
    unsold: 120,
  },
  {
    title: 'Wing C',
    sold: 42,
    blocked: 5,
    unsold: 98,
  },
];

interface InventoryMatrixProps {
  selectedWing: string;
  onWingChange: (wing: string) => void;
  className?: string;
}

export default function InventoryMatrix({ 
  selectedWing, 
  onWingChange, 
  className 
}: InventoryMatrixProps) {
  return (
    <div className={cn('space-y-4 @container', className)}>
      <div className="flex items-center justify-between px-1">
        <Title as="h3" className="text-sm font-bold uppercase tracking-widest text-gray-500">
          Inventory Matrix
        </Title>
        <button className="text-[10px] font-semibold text-[#3498db] hover:underline uppercase tracking-wider">
          Scroll for more →
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {inventoryData.map((wing) => {
          const isSelected = selectedWing === wing.title;
          const total = wing.sold + wing.blocked + wing.unsold;
          const soldWidth = (wing.sold / total) * 100;
          const blockedWidth = (wing.blocked / total) * 100;
          const unsoldWidth = (wing.unsold / total) * 100;

          return (
            <div
              key={wing.title}
              onClick={() => onWingChange(wing.title)}
              className={cn(
                "min-w-[280px] rounded-3xl bg-white p-5 shadow-sm border transition-all cursor-pointer",
                isSelected ? "border-[#3498db] ring-1 ring-[#3498db]/20" : "border-gray-100 hover:border-gray-200"
              )}
            >
              <Title as="h4" className="text-base font-bold text-gray-900 mb-6">
                {wing.title}
              </Title>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <Text className="text-xs font-medium text-gray-400">Sold</Text>
                  <Text className="text-sm font-bold text-green-500">{wing.sold}</Text>
                </div>
                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                  <Text className="text-xs font-medium text-gray-400">Blocked</Text>
                  <Text className="text-sm font-bold text-orange-500">{wing.blocked}</Text>
                </div>
                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                  <Text className="text-xs font-medium text-gray-400">Unsold</Text>
                  <Text className="text-sm font-bold text-[#3498db]">{wing.unsold}</Text>
                </div>
              </div>

              {/* Stacked Progress Bar */}
              <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-gray-100">
                <div style={{ width: `${soldWidth}%` }} className="h-full bg-green-500" />
                <div style={{ width: `${blockedWidth}%` }} className="h-full bg-orange-500" />
                <div style={{ width: `${unsoldWidth}%` }} className="h-full bg-[#3498db]" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
