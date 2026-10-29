'use client';

import dynamic from 'next/dynamic';
import {useCallback, useRef, useState} from 'react';
import styles from './ParkChat.module.css';

const ParkChatPanel = dynamic(() => import('./ParkChatPanel'), {
  ssr: false,
  loading: () => null,
});

function ChatIcon() {
  return <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>;
}

function CloseIcon() {
  return <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg>;
}

export default function ParkChat() {
  const [open, setOpen] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);

  const preloadPanel = useCallback(() => {
    void import('./ParkChatPanel');
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => launcher.current?.focus());
  }, []);

  const toggle = () => {
    if (open) {
      close();
      return;
    }
    setOpen(true);
  };

  return <div className={styles.widget}>
    {open && <ParkChatPanel onClose={close}/>}
    <button
      ref={launcher}
      type="button"
      className={styles.launch}
      aria-expanded={open}
      aria-controls="park-chat"
      onPointerEnter={preloadPanel}
      onFocus={preloadPanel}
      onClick={toggle}
    >
      {open ? <CloseIcon/> : <ChatIcon/>}
      <span>{open ? 'Close' : 'Ask PARK'}</span>
    </button>
  </div>;
}
