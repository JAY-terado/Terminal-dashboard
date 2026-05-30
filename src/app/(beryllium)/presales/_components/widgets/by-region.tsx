'use client';

import { useState } from 'react';
import { Title, Text, Button, Select } from 'rizzui';
import cn from '@core/utils/class-names';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

const regionData = [
  { name: 'Unknown', count: 404 },
  { name: 'Vasai', count: 202 },
  { name: 'Mumbai', count: 155 },
  { name: 'Virar', count: 360 },
  { name: 'Pune', count: 144 },
  { name: 'Thane', count: 190 },
  { name: 'Palghar', count: 100 },
  { name: 'Borivali', count: 85 },
];

const COLORS = ['#3498db', '#10b981', '#f39c12', '#d35400', '#8e44ad', '#2c3e50', '#7f8c8d', '#27ae60'];

const viewOptions = [
  { value: 'grid', label: 'KPI View' },
  { value: 'chart', label: 'Pie View' },
  { value: 'bar', label: 'Bar View' },
];

export default function ByRegion({ 
  className,
  hideHeader = false 
}: { 
  className?: string;
  hideHeader?: boolean;
}) {
  const [view, setView] = useState<'grid' | 'chart' | 'bar'>('bar');

  return (
    <div className={cn('space-y-4', className)}>
      {!hideHeader && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-[#3498db] rounded-full" />
            <Title as="h3" className="text-lg font-bold text-gray-800">
              By Region
            </Title>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={view}
              options={viewOptions}
              onChange={(value: any) => setView(value)}
              variant="text"
              className="w-32"
              selectClassName="text-xs font-semibold text-[#3498db]"
              dropdownClassName="!z-10"
              getOptionValue={(option) => option.value}
              displayValue={(selected) =>
                viewOptions.find((opt) => opt.value === selected)?.label ?? ''
              }
            />
            <Button variant="text" className="text-[#3498db] font-semibold text-sm">
              View More
            </Button>
          </div>
        </div>
      )}

      {(() => {
        const topRegions = regionData.slice(0, 5);
        const otherCount = regionData.slice(5).reduce((acc, curr) => acc + curr.count, 0);
        const chartData = [...topRegions, { name: 'OTHER', count: otherCount }];

        if (view === 'grid') {
          return (
            <div className="grid grid-cols-2 gap-4 @sm:grid-cols-4">
              {regionData.map((item, index) => (
                <div
                  key={item.name}
                  className="group relative flex flex-col items-start justify-center rounded-[1.5rem] bg-white p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-gray-200 overflow-hidden"
                >
                  {/* Color Accent Bar */}
                  <div 
                    className="absolute left-0 top-0 h-full w-1.5 transition-all group-hover:w-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                  />
                  
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 ml-1">
                    {item.name}
                  </Text>
                  <div className="flex items-baseline gap-1 ml-1">
                    <Text className="text-2xl font-black text-gray-900 tracking-tight">
                      {item.count}
                    </Text>
                    <Text className="text-[10px] font-bold text-gray-400">
                      leads
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          );
        }

        if (view === 'bar') {
          return (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-auto min-h-[300px]">
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartData} 
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    barCategoryGap="15%"
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#9ca3af' }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f9fafb' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        }

        return (
          <div className="flex flex-col @md:flex-row items-center justify-between bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-auto min-h-[300px]">
            <div className="w-full h-[200px] @md:h-[250px] @md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '36px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full @md:w-1/2 grid grid-cols-2 gap-x-8 gap-y-4 mt-6 @md:mt-0 @md:pl-8">
              {chartData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div>
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-tight leading-none mb-0.5">
                      {item.name}
                    </Text>
                    <Text className="text-sm font-extrabold text-gray-900">
                      {item.name === 'OTHER' ? (
                        <span className="flex flex-col">
                          <span>{item.count}</span>
                          <span className="text-[8px] font-normal text-gray-400 normal-case">
                            {regionData.slice(5).map(r => r.count).join('+')}={item.count}
                          </span>
                        </span>
                      ) : item.count}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
