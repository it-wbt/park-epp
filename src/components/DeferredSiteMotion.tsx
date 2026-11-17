'use client';

import dynamic from 'next/dynamic';
import {useEffect, useState} from 'react';

const SiteMotion = dynamic(() => import('./SiteMotion'), {ssr:false, loading:() => null});

export default function DeferredSiteMotion() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: {timeout: number}) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(() => setReady(true), {timeout:1800});
      return () => idleWindow.cancelIdleCallback?.(handle);
    }

    const handle = window.setTimeout(() => setReady(true), 800);
    return () => window.clearTimeout(handle);
  }, []);

  return ready ? <SiteMotion/> : null;
}
