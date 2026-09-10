'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  X,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

const entries = [
  {
    id: 'industrial',
    category: 'Industriale',
    title: 'Construcții industriale',
    image: '/images/industrial.webp',
    alt: 'Imagine ilustrativă: hală industrială cu structură metalică',
  },
  {
    id: 'house',
    category: 'Civile',
    title: 'Locuințe',
    image: '/images/portfolio-house.webp',
    alt: 'Imagine ilustrativă: locuință cu două niveluri, fațadă crem și acoperiș metalic',
  },
  {
    id: 'civil',
    category: 'Civile',
    title: 'Construcții civile',
    image: '/images/site-visit.webp',
    alt: 'Imagine ilustrativă: echipă pe un șantier de construcții civile',
  },
  {
    id: 'roof',
    category: 'Civile',
    title: 'Șarpante și acoperișuri',
    image: '/images/portfolio-roof.webp',
    alt: 'Imagine ilustrativă: șarpantă din lemn și învelitoare metalică',
  },
  {
    id: 'rehabilitation',
    category: 'Reabilitări',
    title: 'Reabilitări',
    image: '/images/connection.webp',
    alt: 'Imagine ilustrativă: legătură între o grindă metalică și un stâlp din beton',
  },
];
const filters = ['Toate', 'Civile', 'Industriale', 'Reabilitări'];

export default function Portfolio() {
  const [filter, setFilter] = useState('Toate');
  const [selected, setSelected] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const filterAnimation = useRef<gsap.core.Timeline | null>(null);
  const previousHeight = useRef(0);
  const finishReveals = useRef<() => void>(() => {});
  const grid = useRef<HTMLDivElement>(null),
    dialog = useRef<HTMLDialogElement>(null);
  const visible = entries.filter(
    (entry) => filter === 'Toate' || entry.category === filter,
  );
  const active = selected === null ? null : entries[selected];
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion:no-preference)', () => {
      const scope = root.current!;
      const title = SplitText.create(
        scope.querySelector('.portfolio-heading h1')!,
        { type: 'chars', aria: 'auto' },
      );
      gsap.fromTo(
        title.chars,
        { yPercent: 40, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.2,
          delay: 0.25,
          stagger: { amount: 0.12 },
          ease: 'power3.out',
        },
      );
      gsap.fromTo(
        scope.querySelectorAll(
          '.portfolio-heading>p,.portfolio-preview,.portfolio-filters button',
        ),
        { y: 8, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.2,
          delay: 0.3,
          stagger: 0.025,
          clearProps: 'opacity,transform',
        },
      );
      gsap.fromTo(
        scope.querySelectorAll('.portfolio-rule'),
        { scaleX: 0 },
        { scaleX: 1, duration: 0.45, delay: 0.25, ease: 'power3.out' },
      );
      const reveals: gsap.core.Timeline[] = [];
      const cards = Array.from(
        grid.current!.querySelectorAll<HTMLElement>('.portfolio-item'),
      );
      cards.forEach((card, index) => {
        const mask = card.querySelector('.portfolio-image-mask');
        const caption = card.querySelectorAll('figcaption h2,figcaption>span');
        const mobile = window.matchMedia('(max-width:700px)').matches;
        const rowStart = mobile ? card : cards[index < 2 ? 0 : 2];
        const rowDelay = mobile
          ? 0
          : index < 2
            ? index * 0.09
            : (index - 2) * 0.07;
        const reveal = gsap
          .timeline({
            scrollTrigger: { trigger: rowStart, start: 'top 75%', once: true },
          })
          .fromTo(
            mask,
            { clipPath: 'inset(100% 0 0 0)' },
            {
              clipPath: 'inset(0% 0 0 0)',
              duration: 0.55,
              ease: 'power3.out',
              clearProps: 'clipPath',
            },
            rowDelay,
          )
          .fromTo(
            caption,
            { yPercent: 70, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.2,
              stagger: 0.035,
              clearProps: 'opacity,transform',
            },
            0.23 + rowDelay,
          );
        reveals.push(reveal);
        gsap.fromTo(
          card.querySelector('.portfolio-image-drift'),
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.35,
            },
          },
        );
      });
      finishReveals.current = () =>
        reveals.forEach((animation) => {
          animation.progress(1);
          animation.scrollTrigger?.kill();
        });
      return () => {
        finishReveals.current = () => {};
        title.revert();
      };
    });
    return () => {
      filterAnimation.current?.kill();
      media.revert();
    };
  }, []);
  function changeFilter(value: string) {
    if (value === filter) return;
    filterAnimation.current?.progress(1).kill();
    finishReveals.current();
    if (
      grid.current &&
      !window.matchMedia('(prefers-reduced-motion:reduce)').matches
    ) {
      previousHeight.current = grid.current.offsetHeight;
      flipState.current = Flip.getState(
        grid.current.querySelectorAll('.portfolio-item'),
      );
    }
    setFilter(value);
  }
  useLayoutEffect(() => {
    if (!flipState.current || !grid.current) {
      ScrollTrigger.refresh();
      return;
    }
    const nextHeight = grid.current.offsetHeight;
    filterAnimation.current = Flip.from(flipState.current, {
      duration: 0.45,
      ease: 'power3.inOut',
      scale: true,
      absoluteOnLeave: true,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0 },
          { opacity: 1, duration: 0.2, clearProps: 'opacity' },
        ),
      onLeave: (elements) => gsap.to(elements, { opacity: 0, duration: 0.15 }),
      onComplete: () => ScrollTrigger.refresh(),
    }).fromTo(
      grid.current,
      { height: previousHeight.current },
      { height: nextHeight, duration: 0.45, clearProps: 'height' },
      0,
    );
    flipState.current = null;
  }, [filter]);
  const isOpen = selected !== null;
  useEffect(() => {
    if (!isOpen) return;
    const node = dialog.current!;
    node.showModal();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        setSelected((value) =>
          value === null
            ? null
            : (value + direction + entries.length) % entries.length,
        );
      }
    };
    const backdrop = (event: MouseEvent) => {
      if (event.target === node) setSelected(null);
    };
    node.addEventListener('keydown', key);
    node.addEventListener('click', backdrop);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      node.removeEventListener('keydown', key);
      node.removeEventListener('click', backdrop);
      node.close();
      document.body.style.overflow = previous;
    };
  }, [isOpen]);
  useEffect(() => {
    if (
      selected === null ||
      window.matchMedia('(prefers-reduced-motion:reduce)').matches
    )
      return;
    const animation = gsap.fromTo(
      dialog.current?.querySelector('.portfolio-lightbox-image') ?? null,
      { opacity: 0.25 },
      { opacity: 1, duration: 0.2 },
    );
    return () => {
      animation.kill();
    };
  }, [selected]);
  const move = (direction: number) =>
    setSelected((value) =>
      value === null
        ? null
        : (value + direction + entries.length) % entries.length,
    );
  return (
    <div className="portfolio-page" ref={root}>
      <div className="portfolio-heading">
        <h1>
          Portofoliu<span>.</span>
        </h1>
        <p>Construcții civile, industriale și reabilitări.</p>
      </div>
      <p className="portfolio-preview">
        Previzualizare cu imagini ilustrative. Proiectele reale vor fi adăugate
        în această galerie.
      </p>
      <div className="portfolio-toolbar">
        <span className="portfolio-rule is-top" aria-hidden="true" />
        <fieldset
          className="portfolio-filters"
          aria-label="Filtrează portofoliul"
        >
          {filters.map((value) => (
            <button
              type="button"
              key={value}
              aria-pressed={filter === value}
              onClick={() => changeFilter(value)}
            >
              {value}
            </button>
          ))}
        </fieldset>
        <span aria-live="polite">
          {visible.length} {visible.length === 1 ? 'imagine' : 'imagini'}
        </span>
        <span className="portfolio-rule is-bottom" aria-hidden="true" />
      </div>
      <div
        className="portfolio-grid"
        ref={grid}
        data-filtered={filter !== 'Toate'}
        data-count={visible.length}
      >
        {entries.map((entry, index) => (
          <figure
            className={`portfolio-item ${index === 0 ? 'is-wide' : index === 1 ? 'is-tall' : ''}`}
            style={{
              display:
                filter === 'Toate' || entry.category === filter
                  ? undefined
                  : 'none',
            }}
            key={entry.id}
          >
            <button
              className="portfolio-photo"
              type="button"
              onClick={() => setSelected(entries.indexOf(entry))}
              aria-label={`Mărește imaginea: ${entry.title}`}
            >
              <span className="portfolio-image-mask">
                <span className="portfolio-image-drift">
                  <Image
                    src={entry.image}
                    alt={entry.alt}
                    fill
                    sizes={
                      index === 0
                        ? '(max-width: 700px) 92vw, 62vw'
                        : '(max-width: 700px) 92vw, 32vw'
                    }
                    priority={index < 2}
                  />
                </span>
              </span>
              <span className="portfolio-zoom">
                <Maximize2 size={20} aria-hidden="true" />
              </span>
            </button>
            <figcaption>
              <h2>{entry.title}</h2>
              <span>Imagine ilustrativă</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="portfolio-contact">
        <h2>Ai un proiect?</h2>
        <Link href="/#contact">
          Cere o ofertă <ArrowUpRight size={24} />
        </Link>
      </div>
      <dialog
        className="portfolio-lightbox"
        ref={dialog}
        aria-labelledby="portfolio-image-title"
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
      >
        {active && (
          <div className="portfolio-lightbox-content">
            <button
              type="button"
              className="portfolio-close"
              autoFocus
              aria-label="Închide imaginea"
              onClick={() => setSelected(null)}
            >
              <X size={24} />
            </button>
            <div className="portfolio-lightbox-image">
              <Image src={active.image} alt={active.alt} fill sizes="94vw" />
            </div>
            <div className="portfolio-lightbox-caption">
              <div>
                <h2 id="portfolio-image-title">{active.title}</h2>
                <p>Imagine ilustrativă</p>
              </div>
              <div className="portfolio-image-controls">
                <button
                  type="button"
                  aria-label="Imaginea precedentă"
                  onClick={() => move(-1)}
                >
                  <ArrowLeft size={22} />
                </button>
                <span>
                  {(selected ?? 0) + 1} / {entries.length}
                </span>
                <button
                  type="button"
                  aria-label="Imaginea următoare"
                  onClick={() => move(1)}
                >
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
