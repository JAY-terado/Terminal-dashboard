'use client';

import BerylLiumLayout from '@/layouts/beryllium/beryllium-layout';
import { usePathname } from 'next/navigation';

export default function SharedBerylliumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Define paths that should NOT have the dashboard layout (e.g., auth pages)
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/signup');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <BerylLiumLayout>{children}</BerylLiumLayout>;
}
