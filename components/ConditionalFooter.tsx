'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Define routes where the footer should NOT be displayed (Portals & Auth)
  const isPortalOrAuthRoute = ['/staff', '/admin', '/login', '/signup', '/dashboard'].some(
    path => pathname?.startsWith(path)
  );

  if (isPortalOrAuthRoute) {
    return null; // Free up maximum screen space for internal portals
  }

  return <Footer />;
}