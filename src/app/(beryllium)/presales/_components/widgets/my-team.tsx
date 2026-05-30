'use client';

import { Title, Text, Button, Avatar } from 'rizzui';
import cn from '@core/utils/class-names';

interface TeamMember {
  name: string;
  role: string;
  totalLeads: number;
  breakdown: {
    new: number;
    followUp: number;
    sitDn: number;
    cust: number;
  };
}

const teamData: TeamMember[] = [
  {
    name: 'Pam Infrastructures',
    role: 'Sales Lead',
    totalLeads: 413,
    breakdown: { new: 71, followUp: 338, sitDn: 0, cust: 3 },
  },
  {
    name: 'Prashant Sane',
    role: 'Sales Lead',
    totalLeads: 30,
    breakdown: { new: 14, followUp: 16, sitDn: 0, cust: 0 },
  },
  {
    name: 'Pritam Vartak',
    role: 'Sales Lead',
    totalLeads: 7,
    breakdown: { new: 5, followUp: 2, sitDn: 0, cust: 0 },
  },
  {
    name: 'Rimple Sarvaiya',
    role: 'Sales Lead',
    totalLeads: 6,
    breakdown: { new: 2, followUp: 0, sitDn: 0, cust: 4 },
  },
  {
    name: 'Meet Jain',
    role: 'Manager',
    totalLeads: 15,
    breakdown: { new: 93, followUp: 362, sitDn: 7, cust: 1 },
  },
  {
    name: 'Anjali Sharma',
    role: 'Sales Exec',
    totalLeads: 5,
    breakdown: { new: 10, followUp: 30, sitDn: 2, cust: 3 },
  },
];

function getInitials(name: string) {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function MyTeam({ 
  className,
  hideHeader = false 
}: { 
  className?: string;
  hideHeader?: boolean;
}) {
  return (
    <div className={cn('space-y-4 @container', className)}>
      {!hideHeader && (
        <div className="flex items-center justify-between px-1">
          <Title as="h3" className="text-xl font-bold text-gray-900">
            My Team
          </Title>
          <Button variant="text" className="text-[#3498db] font-semibold text-sm hover:underline">
            View All
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 @[600px]:grid-cols-2 @[900px]:grid-cols-3">
        {teamData.map((member) => (
          <div
            key={member.name}
            className="rounded-[2rem] bg-white p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-[#3498db]/20"
          >
            <div className="flex flex-col @[280px]:flex-row @[280px]:items-center justify-between mb-4 gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f7ff] text-[#3498db] font-semibold text-xs tracking-tighter">
                  {getInitials(member.name)}
                </div>
                <div className="min-w-0">
                  <Title as="h4" className="text-sm font-bold text-gray-900 leading-tight truncate">
                    {member.name}
                  </Title>
                  <Text className="text-[10px] font-medium text-gray-400">
                    {member.role}
                  </Text>
                </div>
              </div>
              <div className="text-left @[280px]:text-right">
                <Text className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Leads
                </Text>
                <Text className="text-xl font-extrabold text-[#3498db]">
                  {member.totalLeads}
                </Text>
              </div>
            </div>

            <div className="h-[1px] bg-gray-100 w-full mb-4" />

            <div className="grid grid-cols-2 @[350px]:grid-cols-4 gap-2">
              <div className="text-center">
                <Text className="text-[9px] font-bold text-gray-400 mb-0.5">New</Text>
                <Text className="text-sm font-bold text-gray-900">{member.breakdown.new}</Text>
              </div>
              <div className="text-center border-s border-gray-100">
                <Text className="text-[9px] font-bold text-gray-400 mb-0.5">Follow</Text>
                <Text className="text-sm font-bold text-gray-900">{member.breakdown.followUp}</Text>
              </div>
              <div className="text-center border-s border-gray-50 @[350px]:border-gray-100">
                <Text className="text-[9px] font-bold text-gray-400 mb-0.5">Sit-Dn</Text>
                <Text className="text-sm font-bold text-gray-900">{member.breakdown.sitDn}</Text>
              </div>
              <div className="text-center border-s border-gray-100">
                <Text className="text-[9px] font-bold text-gray-400 mb-0.5">Cust</Text>
                <Text className="text-sm font-bold text-[#3498db]">{member.breakdown.cust}</Text>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
