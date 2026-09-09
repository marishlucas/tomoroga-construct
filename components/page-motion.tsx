'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/** Short, once-only entrances. Navigation animations belong to their controls. */
export default function PageMotion() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const media = gsap.matchMedia();
    let disposed = false;

    void document.fonts.ready.then(() => {
      if (disposed) return;
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const root = document.querySelector('main#continut');
        if (!root) return;
        const splits: SplitText[] = [];
        const animations: gsap.core.Animation[] = [];
        const triggers: ScrollTrigger[] = [];

        root.querySelectorAll<HTMLElement>('.hero8 h1, .home-sections h2').forEach(heading => {
          triggers.push(ScrollTrigger.create({
            trigger: heading, start: 'top 94%', once: true,
            onEnter: () => {
              splits.push(SplitText.create(heading, {
                type: 'words,chars', autoSplit: true, aria: 'auto',
                onSplit: split => {
                  const animation = gsap.fromTo(split.chars,
                    { yPercent: 28, opacity: 0 },
                    { yPercent: 0, opacity: 1, duration: .2, stagger: { amount: .1 }, ease: 'power2.out', onComplete: () => split.revert() });
                  animations.push(animation);
                  return animation;
                },
              }));
            },
          }));
        });

        root.querySelectorAll<HTMLElement>('.hero8-copy p, .hero8-actions, .gallery-track, .process-picture, .detail-picture, .project-enquiry').forEach(element => {
          triggers.push(ScrollTrigger.create({
            trigger: element, start: 'top 94%', once: true,
            onEnter: () => {
              animations.push(gsap.fromTo(element, { opacity: .15 },
                { opacity: 1, duration: .2, ease: 'power2.out', clearProps: 'opacity' }));
            },
          }));
        });
        return () => {
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
