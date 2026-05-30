'use client';

import { Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiWalletBold } from 'react-icons/pi';

export default function PaymentDetails({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-[2rem] bg-white p-6 shadow-sm border border-gray-100 @container',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f5e9] text-[#4caf50]">
          <PiWalletBold className="h-6 w-6" />
        </div>
        <Title as="h3" className="text-sm font-bold uppercase tracking-widest text-gray-800">
          Payment Details
        </Title>
      </div>

      <div className="mb-6">
        <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
          Total Received
        </Text>
        <div className="flex items-end justify-between">
          <Title as="h2" className="text-4xl font-extrabold text-gray-900">
            ₹22.82 Cr
          </Title>
          <div className="rounded-full bg-[#e8f5e9] px-4 py-1">
            <Text className="text-[10px] font-bold text-[#4caf50]">COLLECTED</Text>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 w-full rounded-full bg-gray-100 mb-8 overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-[85%] bg-[#3498db] rounded-full" />
        <div className="absolute left-[85%] top-0 h-full w-[10%] bg-blue-500" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-[#3498db]" />
            <Text className="text-[9px] font-bold uppercase text-gray-400">Basic</Text>
          </div>
          <Text className="text-sm font-bold text-gray-900">₹22.19 Cr</Text>
          <Text className="text-[8px] font-medium text-gray-400 mt-1">Basic Value</Text>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <Text className="text-[9px] font-bold uppercase text-gray-400">GST (5%)</Text>
          </div>
          <Text className="text-sm font-bold text-gray-900">₹0.59 Cr</Text>
          <Text className="text-[8px] font-medium text-gray-400 mt-1">GST Collected</Text>
        </div>
        <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-gray-500" />
            <Text className="text-[9px] font-bold uppercase text-gray-400">TDS (1%)</Text>
          </div>
          <Text className="text-sm font-bold text-gray-900">₹0.04 Cr</Text>
          <Text className="text-[8px] font-medium text-gray-400 mt-1">TDS Collected</Text>
        </div>
      </div>
    </div>
  );
}
