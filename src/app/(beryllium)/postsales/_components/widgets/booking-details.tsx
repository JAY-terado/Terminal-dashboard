'use client';

import { Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiBookOpenBold } from 'react-icons/pi';

export default function BookingDetails({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-[2rem] bg-white p-6 shadow-sm border border-gray-100 @container',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3f2fd] text-[#3498db]">
          <PiBookOpenBold className="h-6 w-6" />
        </div>
        <Title as="h3" className="text-sm font-bold uppercase tracking-widest text-gray-800">
          Booking Details
        </Title>
      </div>

      <div className="mb-8">
        <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
          Total Booking Value
        </Text>
        <div className="flex items-end justify-between">
          <Title as="h2" className="text-4xl font-extrabold text-gray-900">
            ₹98.97 Cr
          </Title>
          <div className="rounded-full bg-[#f0f7ff] px-4 py-1">
            <Text className="text-[10px] font-bold text-[#3498db]">109 Units</Text>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-50">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Registered
            </Text>
          </div>
          <Text className="text-xl font-bold text-gray-900">₹41.84 Cr</Text>
          <Text className="text-[10px] font-bold text-green-500 mt-1">45 Units</Text>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-orange-500" />
            <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Not Registered
            </Text>
          </div>
          <Text className="text-xl font-bold text-gray-900">₹57.13 Cr</Text>
          <Text className="text-[10px] font-bold text-orange-500 mt-1">64 Units</Text>
        </div>
      </div>
    </div>
  );
}
