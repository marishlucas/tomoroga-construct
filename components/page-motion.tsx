'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/** Entrances wait until their own element crosses three quarters of the viewport. */
export default function PageMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const media = gsap.matchMedia();
    let disposed = false;

    void document.fonts.ready.then(() => {
      if (disposed) return;
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const root = document.querySelector('.home-sections');
        if (!root) return;
        const splits: SplitText[] = [];
        const animations: gsap.core.Animation[] = [];
        const triggers: ScrollTrigger[] = [];
        const enter = (element: Element, animation: gsap.core.Animation) => {
          animations.push(animation);
          triggers.push(ScrollTrigger.create({
            trigger: element, start: 'clamp(top 75%)', once: true,
            animation, toggleActions: 'play none none none',
          }));
          // Keyboard focus must never land on an invisible control.
          const revealOnFocus = () => animation.progress(1);
          element.addEventListener('focusin', revealOnFocus);
          return () => element.removeEventListener('focusin', revealOnFocus);
        };
        const focusCleanups: Array<() => void> = [];

        root.querySelectorAll<HTMLElement>(':scope > section h2').forEach(heading => {
          const accessibleTitle = heading.innerText.replace(/\s+/g, ' ').trim();
          const split = SplitText.create(heading, { type: 'words,chars', autoSplit: true, aria: 'auto',
            onSplit: self => {
              heading.setAttribute('aria-label', accessibleTitle);
              const animation = gsap.fromTo(self.chars,
                { yPercent: 45, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: .2, stagger: { amount: .1 }, ease: 'power2.out', paused: true,
                  onComplete: () => self.revert() });
              focusCleanups.push(enter(heading, animation));
              return animation;
            },
          });
          splits.push(split);
        });

        // Reveal the photograph across its frame. The photograph itself stays still.
        root.querySelectorAll<HTMLElement>('.gallery-track, .process-picture, .detail-picture').forEach(frame => {
          focusCleanups.push(enter(frame, gsap.fromTo(frame,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
            { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: .2, ease: 'power2.out', paused: true, clearProps: 'clipPath,opacity' })));
        });

        const groups = [
          ['.project-categories', 'button'],
          ['.section-arrows', 'button'],
          ['.process-steps', '[role="tab"]'],
          ['.detail-picture', '.detail-hotspot'],
        ];
        groups.forEach(([selector, childSelector]) => {
          root.querySelectorAll<HTMLElement>(selector).forEach(group => {
            focusCleanups.push(enter(group, gsap.fromTo(group.querySelectorAll(childSelector),
              { y: 14, opacity: 0 },
              { y: 0, opacity: 1, duration: .2, stagger: .035, ease: 'power2.out', paused: true, clearProps: 'transform,opacity' })));
          });
        });
        root.querySelectorAll<HTMLElement>('.process-panels, .detail-descriptions').forEach(element => {
          focusCleanups.push(enter(element, gsap.fromTo(element,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: .2, ease: 'power2.out', paused: true, clearProps: 'transform,opacity' })));
        });

        const lines = [
          ['.process-navigation', '--rail-progress'],
          ['.process-marker > span', '--stem-progress'],
          ['.detail-descriptions', '--detail-line-progress'],
        ];
        lines.forEach(([selector, property]) => {
          root.querySelectorAll<HTMLElement>(selector).forEach(line => {
            focusCleanups.push(enter(line, gsap.fromTo(line, { [property]: 0 },
              { [property]: 1, duration: .2, ease: 'power2.out', paused: true })));
          });
        });

        return () => {
          focusCleanups.forEach(cleanup => cleanup());
          triggers.forEach(trigger => trigger.kill());
          animations.forEach(animation => animation.revert());
          splits.forEach(split => split.revert());
        };
      });
    });
    return () => { disposed = true; media.revert(); };
  }, []);

  return null;
}
