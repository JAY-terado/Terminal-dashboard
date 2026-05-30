'use client';

import { useState } from 'react';
import { Title, Button, ActionIcon, Text } from 'rizzui';
import { PiXBold } from 'react-icons/pi';
import cn from '@core/utils/class-names';
import { useModal } from '@/app/shared/modal-views/use-modal';

const layouts = [
  {
    id: 'blank',
    title: 'Blank',
    panelCount: 0,
    preview: (
      <div className="h-full w-full border-2 border-gray-200 rounded-md bg-white" />
    ),
  },
  {
    id: 'trade',
    title: 'Trade',
    panelCount: 4,
    preview: (
      <div className="flex h-full w-full gap-1 p-1 border-2 border-gray-200 rounded-md bg-white">
        <div className="w-1/2 border-2 border-gray-200 rounded-sm" />
        <div className="flex flex-col w-1/2 gap-1">
          <div className="h-1/2 border-2 border-gray-200 rounded-sm" />
          <div className="flex h-1/2 gap-1">
            <div className="w-1/2 border-2 border-gray-200 rounded-sm" />
            <div className="w-1/2 border-2 border-gray-200 rounded-sm" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'invest',
    title: 'Invest',
    panelCount: 4,
    preview: (
      <div className="flex flex-col h-full w-full gap-1 p-1 border-2 border-gray-200 rounded-md bg-white">
        <div className="h-1/2 border-2 border-gray-200 rounded-sm" />
        <div className="flex h-1/2 gap-1">
          <div className="w-1/3 border-2 border-gray-200 rounded-sm" />
          <div className="w-1/3 border-2 border-gray-200 rounded-sm" />
          <div className="w-1/3 border-2 border-gray-200 rounded-sm" />
        </div>
      </div>
    ),
  },
  {
    id: 'scalper',
    title: 'Scalper',
    panelCount: 3,
    preview: (
      <div className="flex h-full w-full gap-1 p-1 border-2 border-gray-200 rounded-md bg-white">
        <div className="flex flex-col w-2/3 gap-1">
          <div className="h-1/2 border-2 border-gray-200 rounded-sm" />
          <div className="h-1/2 border-2 border-gray-200 rounded-sm" />
        </div>
        <div className="w-1/3 border-2 border-gray-200 rounded-sm" />
      </div>
    ),
  },
  {
    id: 'simple',
    title: 'Simple',
    panelCount: 2,
    preview: (
      <div className="flex h-full w-full gap-1 p-1 border-2 border-gray-200 rounded-md bg-white">
        <div className="w-1/2 border-2 border-gray-200 rounded-sm" />
        <div className="w-1/2 border-2 border-gray-200 rounded-sm" />
      </div>
    ),
  },
  {
    id: 'grid',
    title: 'Grid 2x2',
    panelCount: 4,
    preview: (
      <div className="flex flex-col h-full w-full gap-1 p-1 border-2 border-gray-200 rounded-md bg-white">
        <div className="flex h-1/2 gap-1">
          <div className="w-1/2 border-2 border-gray-200 rounded-sm" />
          <div className="w-1/2 border-2 border-gray-200 rounded-sm" />
        </div>
        <div className="flex h-1/2 gap-1">
          <div className="w-1/2 border-2 border-gray-200 rounded-sm" />
          <div className="w-1/2 border-2 border-gray-200 rounded-sm" />
        </div>
      </div>
    ),
  },
];

export default function WorkspaceLayoutSelector({
  onCreate,
}: {
  onCreate: (name: string, layoutId: string) => void;
}) {
  const { closeModal } = useModal();
  const [selected, setSelected] = useState('trade');
  const [workspaceName, setWorkspaceName] = useState('');

  const isDisabled = selected === 'blank' && workspaceName.trim() === '';

  return (
    <div className="p-6 @container">
      <div className="flex items-center justify-between mb-8">
        <Title as="h3" className="text-lg font-semibold">
          New Workspace
        </Title>
        <ActionIcon variant="text" onClick={() => closeModal()}>
          <PiXBold className="h-5 w-5" />
        </ActionIcon>
      </div>

      <input 
        autoFocus
        value={workspaceName}
        onChange={(e) => setWorkspaceName(e.target.value)}
        placeholder="Workspace name (e.g. Intraday, Options)"
        className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full mb-2 focus:ring-2 focus:ring-[#3498db] focus:border-transparent outline-none transition-all"
      />
      {isDisabled && (
        <Text className="text-xs text-red-500 mb-6">
          Give your workspace a name to continue
        </Text>
      )}
      {!isDisabled && <div className="mb-6" />}

      <div className="grid grid-cols-2 @md:grid-cols-3 gap-6 mb-8">
        {layouts.map((layout) => (
          <div
            key={layout.id}
            onClick={() => setSelected(layout.id)}
            className={cn(
              'group cursor-pointer flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all',
              selected === layout.id
                ? 'border-[#3498db] bg-blue-50/30'
                : 'border-transparent bg-gray-50/50 hover:bg-gray-50'
            )}
          >
            <div
              className={cn(
                'w-full aspect-[4/3] rounded-lg overflow-hidden transition-colors',
                selected === layout.id
                  ? '[&_div]:border-[#3498db] [&_div]:bg-[#3498db]/10'
                  : '[&_div]:border-gray-200 [&_div]:bg-transparent'
              )}
            >
              {layout.preview}
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span
                className={cn(
                  'text-xs font-bold uppercase tracking-wider',
                  selected === layout.id ? 'text-[#3498db]' : 'text-gray-400'
                )}
              >
                {layout.title}
              </span>
              {layout.panelCount > 0 && (
                <span className="text-[9px] text-gray-400 font-medium">
                  {layout.panelCount} panels
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
        <Button
          variant="text"
          className="font-bold text-gray-500"
          onClick={() => closeModal()}
        >
          Cancel
        </Button>
        <Button
          className="bg-[#3498db] text-white font-bold px-8 rounded-xl disabled:bg-gray-200 disabled:text-gray-400"
          disabled={isDisabled}
          onClick={() => {
            onCreate(workspaceName.trim() || layouts.find(l => l.id === selected)?.title || selected, selected);
            closeModal();
          }}
        >
          Create
        </Button>
      </div>
    </div>
  );
}
