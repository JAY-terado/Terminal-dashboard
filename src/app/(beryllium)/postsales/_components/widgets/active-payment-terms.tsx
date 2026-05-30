'use client';

import { Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiCreditCardBold } from 'react-icons/pi';

const paymentTerms = [
  {
    title: 'WING B AGREEMENT',
    percentage: '54.45%',
    dates: 'Starts: 01 May 25 / Ends: 01 May 30',
    status: 'ACTIVE',
  },
  {
    title: 'WING C AGREEMENT',
    percentage: '54.45%',
    dates: 'Starts: 01 May 25 / Ends: 01 May 30',
    status: 'ACTIVE',
  },
  {
    title: 'WING A AGREEMENT',
    percentage: '30.00%',
    dates: 'Starts: 01 May 25 / Ends: 01 May 30',
    status: 'ACTIVE',
  },
];

export default function ActivePaymentTerms({ 
  selectedWing = '', 
  className 
}: { 
  selectedWing?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-[2.5rem] bg-white p-6 shadow-sm border border-gray-100 @container',
        className
      )}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e5f5] text-[#9c27b0]">
          <PiCreditCardBold className="h-6 w-6" />
        </div>
        <Title as="h3" className="text-sm font-bold uppercase tracking-widest text-gray-800">
          Active Payment Terms
        </Title>
      </div>

      <div className="space-y-4">
        {paymentTerms.map((term, index) => {
          const isSelected = selectedWing && term.title.includes(selectedWing.toUpperCase());
          return (
            <div
              key={term.title + index}
              className={cn(
                "rounded-[1.5rem] p-5 border transition-all duration-300 flex items-center justify-between",
                isSelected 
                  ? "bg-[#f0f7ff] border-[#3498db]/30 shadow-sm" 
                  : "bg-gray-50 border-gray-100"
              )}
            >
            <div>
              <Title as="h4" className="text-xs font-bold text-gray-900 mb-1">
                {term.title}
              </Title>
              <Text className="text-[10px] font-medium text-gray-400">
                {term.dates}
              </Text>
            </div>
            <div className="text-right">
              <Title as="h2" className="text-lg font-bold text-gray-900 mb-1">
                {term.percentage}
              </Title>
              <div className="inline-block rounded-md bg-[#e8f5e9] px-2 py-0.5">
                <Text className="text-[9px] font-bold text-[#4caf50]">
                  {term.status}
                </Text>
              </div>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
