'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { workspacesAtom } from '@/app/(beryllium)/presales/_components/workspace/workspace-atoms';
import { routes } from '@/config/routes';
import cn from '@core/utils/class-names';
import { useColorPresetName } from '@/layouts/settings/use-theme-color';
import {
  PiSquaresFourBold,
  PiCaretDownBold,
  PiHouseLine,
  PiTerminalWindowBold,
} from 'react-icons/pi';
import { Collapse } from 'rizzui';

/**
 * A specialised sidebar group for the Pre-Sales section.
 * Renders:
 *   • Pre-Sales Dashboard  (static link)
 *   └─ Terminal Mode       (collapsible)
 *        ├─ Trade Desk     (saved workspace)
 *        ├─ ...
 *        └─ + New          (go to dashboard to create)
 */
export default function PresalesSidebarGroup() {
  const pathname = usePathname();
  const router = useRouter();
  const { colorPresetName } = useColorPresetName();
  const workspaces = useAtomValue(workspacesAtom);

  const isTerminalActive = pathname.startsWith('/presales/terminal');
  const isDashboardActive = pathname === routes.presales.dashboard;

  const activeClass =
    colorPresetName === 'black'
      ? 'bg-gray-100 text-primary dark:bg-gray-100 dark:text-primary'
      : 'bg-gray-100 text-primary dark:bg-gray-100';

  return (
    <div className="flex flex-col gap-2">
      {/* Pre-Sales Dashboard link */}
      <Link
        href={routes.presales.dashboard}
        className={cn(
          'flex items-center justify-between gap-3 rounded-2xl px-4 py-2 font-medium duration-200',
          isDashboardActive
            ? activeClass
            : 'hover:bg-gray-100 hover:text-gray-900'
        )}
      >
        <div className="flex items-center gap-2 truncate text-sm">
          <PiHouseLine className="h-5 w-5 shrink-0" />
          <span className="truncate text-sm">Pre-Sales Dashboard</span>
        </div>
        <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600">
          NEW
        </span>
      </Link>

      {/* Terminal Mode collapsible */}
      <Collapse
        defaultOpen={isTerminalActive}
        className="[&>div]:mx-4 [&>div]:my-2 [&>div]:px-4 [&>div]:py-2 [&>div]:lg:my-0 [&>div]:2xl:mx-0 [&>div]:2xl:my-0"
        panelClassName="[&>a]:px-0 xl:!mt-2 [&>a]:mx-0 [&>a]:py-0 [&>a]:ps-4 [&>a]:my-0 space-y-3"
        header={({ open, toggle }) => (
          <div
            className={cn(
              'group relative flex items-center justify-between rounded-full px-4 py-2 font-medium duration-200',
              isTerminalActive || open
                ? activeClass
                : 'hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            {/* Click the icon/label to navigate */}
            <div 
              onClick={() => router.push(routes.presales.terminal())}
              className="flex flex-grow items-center gap-3 cursor-pointer"
            >
              <PiTerminalWindowBold className="h-5 w-5 shrink-0" />
              <span className="text-sm">Dashboard</span>
              
            </div>
            
            {/* Click the arrow to toggle sub-items */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
              className="p-1 cursor-pointer hover:bg-gray-200 rounded-full transition-colors"
            >
              <PiCaretDownBold
                className={cn(
                  'h-3.5 w-3.5 -rotate-90 text-gray-500 transition-transform duration-200 rtl:rotate-90',
                  open && 'rotate-0 rtl:rotate-0',
                  isTerminalActive && 'text-primary'
                )}
              />
            </div>
          </div>
        )}
      >
        {/* Saved workspace items */}
        {workspaces.map((ws) => {
          const href = routes.presales.terminal(ws.id);
          const isActive = pathname === href;
          return (
            <Link
              key={ws.id}
              href={href}
              className={cn(
                'mx-3.5 mb-0.5 flex items-center gap-2 rounded-md px-3.5 py-2 font-medium capitalize duration-200 last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-5',
                isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'
              )}
            >
              <span
                className={cn(
                  'me-[10px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary ring-[1px] ring-primary'
                    : 'opacity-40'
                )}
              />
              <PiSquaresFourBold className="h-3.5 w-3.5 shrink-0 opacity-60" />
              <span className="truncate text-[13px]">{ws.name}</span>
              <span className="ms-auto shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-400">
                {ws.layoutId}
              </span>
            </Link>
          );
        })}

        {/* Fallback if no workspaces */}
        {workspaces.length === 0 && (
          <div className="mx-3.5 mb-0.5 flex items-center gap-2 rounded-md px-3.5 py-2 text-xs text-gray-400 2xl:mx-5">
            <span className="me-[10px] ms-1 inline-flex h-1 w-1 rounded-full bg-current opacity-20" />
            No saved workspaces
          </div>
        )}
      </Collapse>
    </div>
  );
}
