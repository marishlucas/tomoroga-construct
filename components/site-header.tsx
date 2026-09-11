'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const focus = (event: FocusEvent) => {
      if (
        event.relatedTarget &&
        !header.current?.contains(event.relatedTarget as Node)
      )
        setOpen(false);
    };
    const node = header.current;
    node?.addEventListener('focusout', focus);
    document.addEventListener('keydown', key);
    document.addEventListener('pointerdown', outside);
    return () => {
      node?.removeEventListener('focusout', focus);
      document.removeEventListener('keydown', key);
      document.removeEventListener('pointerdown', outside);
    };
  }, [open]);
  const home = pathname === '/';
  return (
    <header className="site-navigation-header" ref={header}>
      <div className="site-navigation-inner">
        <a
          href={home ? '#continut' : '/'}
          className="brand"
          aria-label="Tomoroga Construct — Acasă"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/tomoroga-logo.png"
            alt="Tomoroga Construct"
            width={179}
            height={179}
            priority
          />
        </a>
        <nav
          id="site-navigation"
          className={open ? 'site-links is-open' : 'site-links'}
          aria-label="Navigare principală"
        >
          <a
            href={home ? '#continut' : '/'}
            aria-current={home ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            Acasă
          </a>
          <a
            href="/portofoliu"
            aria-current={pathname === '/portofoliu' ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            Portofoliu
          </a>
          <a
            href={home ? '#contact' : '/#contact'}
            onClick={() => setOpen(false)}
          >
            Cere o ofertă <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </nav>
        <button
          className="site-menu-toggle"
          ref={toggle}
          type="button"
          aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
    </header>
  );
}
