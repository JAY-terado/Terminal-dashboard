'use client';

import { Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import { 
  PiGoogleLogo, 
  PiFacebookLogo, 
  PiPhoneBold, 
  PiNavigationArrowBold, 
  PiBrowserBold 
} from 'react-icons/pi';

const leadSources = [
  {
    name: 'Google',
    count: 2,
    icon: PiGoogleLogo,
  },
  {
    name: 'FB',
    count: 0,
    icon: PiFacebookLogo,
  },
  {
    name: 'Direct',
    count: 458,
    icon: PiPhoneBold,
  },
  {
    name: 'Walk-in',
    count: 0,
    icon: PiNavigationArrowBold,
  },
  {
    name: 'Website',
    count: 2,
    icon: PiBrowserBold,
  },
];

export default function TotalLeads({ 
  className,
  hideHeader = false 
}: { 
  className?: string;
  hideHeader?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-[2rem] bg-[#3498db] p-6 text-white shadow-sm @container',
        hideHeader && 'rounded-none !bg-transparent !p-0 !text-gray-900',
        className
      )}
    >
      {!hideHeader ? (
        <div className="mb-6">
          <Text className="text-sm font-medium uppercase tracking-wider opacity-90">
            Total Leads
          </Text>
          <Title as="h2" className="text-5xl font-bold mt-1">
            463
          </Title>
        </div>
      ) : (
        <div className="mb-4">
          <Title as="h2" className="text-3xl font-bold text-[#3498db]">
            463 <span className="text-xs font-normal text-gray-400 uppercase tracking-widest ml-2">Total Leads</span>
          </Title>
        </div>
      )}

      <div className="grid grid-cols-2 @[300px]:grid-cols-3 @[500px]:grid-cols-5 gap-2 @sm:gap-4">
        {leadSources.map((source) => {
          const Icon = source.icon;
          return (
            <div
              key={source.name}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl p-2 transition-colors",
                !hideHeader ? "bg-white/20 backdrop-blur-sm hover:bg-white/30" : "bg-gray-50 border border-gray-100 hover:bg-blue-50"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full mb-2 shadow-sm",
                !hideHeader ? "bg-white text-[#3498db]" : "bg-[#3498db] text-white"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <Text className="text-[10px] font-semibold @sm:text-xs">
                {source.name}
              </Text>
              <Text className="text-sm font-bold @sm:text-base">
                {source.count}
              </Text>
            </div>
          );
        })}
      </div>
    </div>
  );
}
