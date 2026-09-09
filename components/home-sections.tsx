'use client';

import { useLayoutEffect, useRef, useState, type SyntheticEvent, type RefObject } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const projects = [
  { id: 'civil', label: 'Civile', title: 'Locuri pentru oameni.', image: 'site-visit', alt: 'Imagine ilustrativă: echipă și structură din beton pe un șantier', url: 'https://www.tomorogaconstruct.ro/constructii-civile/' },
  { id: 'industrial', label: 'Industriale', title: 'Spații pentru ceea ce urmează.', image: 'industrial', alt: 'Imagine ilustrativă: hală industrială cu structură metalică în lumina apusului', url: 'https://www.tomorogaconstruct.ro/constructii-industriale/' },
  { id: 'rehabilitation', label: 'Reabilitare', title: 'Un nou capitol pentru clădiri.', image: 'connection', alt: 'Imagine ilustrativă: îmbinare între o grindă de oțel și un stâlp din beton', url: 'https://www.tomorogaconstruct.ro/' },
];

const steps = [
  { label: 'Discuție', title: 'Începem cu ideea ta.', text: 'Ce vrei să construiești, unde și în ce etapă te afli. Punem întrebările care clarifică proiectul.' },
  { label: 'Vizită', title: 'Înțelegem locul.', text: 'Nevoile proiectului, privite de aproape. Terenul, accesul și construcțiile existente dau context următorilor pași.' },
  { label: 'Propunere', title: 'Dăm contur planului.', text: 'Discutăm lucrările, etapele și resursele necesare. O bază clară pentru deciziile care urmează.' },
  { label: 'Execuție', title: 'Planul prinde formă.', text: 'De la structură la finisaje, urmărim etapele lucrării și discutăm progresul pe parcurs.' },
  { label: 'Predare', title: 'Privim fiecare detaliu.', text: 'Parcurgem împreună rezultatul și punctele de închidere a lucrării. Ultimul pas al unui proiect, începutul utilizării lui.' },
];

const details = [
  { title: 'Îmbinări precise.', text: 'Detaliile care dau coerență întregului. Explorează întâlnirea dintre oțel, prinderi și beton.', x: 54, y: 43 },
  { title: 'Structura, la vedere.', text: 'Grinzi, stâlpi și legături. Fiecare element are un loc în ansamblul construcției.', x: 83, y: 20 },
  { title: 'Materiale în dialog.', text: 'Textura betonului și precizia oțelului, privite de aproape. Două materiale, o singură construcție.', x: 26, y: 76 },
];

function usePanelMotion(ref: RefObject<HTMLDivElement | null>, value: string | number) {
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (ref.current) gsap.fromTo(ref.current, { opacity: .4 },
        { opacity: 1, duration: .2, ease: 'power2.out', clearProps: 'opacity' });
    });
    return () => media.revert();
  }, [ref, value]);
}

function ArrowControls({ previous, next, label, atStart = false, atEnd = false }: { previous: () => void; next: () => void; label: string; atStart?: boolean; atEnd?: boolean }) {
  return <div className="section-arrows">
    <Button className="section-arrow" variant="outline" size="icon" aria-label={`${label}: anterior`} disabled={atStart} onClick={previous}><ArrowLeft aria-hidden="true" /></Button>
    <Button className="section-arrow is-forward" size="icon" aria-label={`${label}: următor`} disabled={atEnd} onClick={next}><ArrowRight aria-hidden="true" /></Button>
  </div>;
}

function ProjectGallery() {
  const [active, setActive] = useState(1);
  const viewport = useRef<HTMLDivElement>(null);
  const activeIndex = useRef(1);
  const tween = useRef<gsap.core.Tween | null>(null);
  const drag = useRef<{ x: number; scroll: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  function slidePosition(index: number) {
    const node = viewport.current!;
    const slide = node.children[index] as HTMLElement;
    const first = node.children[0] as HTMLElement;
    return slide.offsetLeft - first.offsetLeft;
  }
  function goTo(index: number) {
    const node = viewport.current;
    if (!node) return;
    const next = Math.max(0, Math.min(projects.length - 1, index));
    activeIndex.current = next;
    setActive(next);
    tween.current?.kill();
    node.style.scrollSnapType = 'none';
    tween.current = gsap.to(node, {
      scrollLeft: slidePosition(next), duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : .65,
      ease: 'power3.inOut', overwrite: true,
      onComplete: () => { tween.current = null; node.style.scrollSnapType = ''; },
    });
  }
  function interrupt() {
    tween.current?.kill();
    tween.current = null;
    if (viewport.current) viewport.current.style.scrollSnapType = '';
  }
  useLayoutEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const align = () => {
      tween.current?.kill();
      tween.current = null;
      node.style.scrollSnapType = 'none';
      node.scrollLeft = slidePosition(activeIndex.current);
      node.style.scrollSnapType = '';
    };
    align();
    const observer = new ResizeObserver(align);
    observer.observe(node);
    return () => { observer.disconnect(); tween.current?.kill(); };
  }, []);

  return <section className="project-gallery" id="expertiza" aria-labelledby="gallery-heading" aria-roledescription="carusel">
    <div className="gallery-heading section-shell">
      <h2 id="gallery-heading">Construcții<br />care vorbesc.</h2>
      <fieldset className="project-categories" aria-label="Tipuri de construcții">
        {projects.map((project, i) => <button type="button" key={project.id} aria-pressed={active === i} aria-controls="project-carousel" onClick={() => goTo(i)}>{project.label}</button>)}
      </fieldset>
    </div>
    {/* A scrollable region must be focusable for native keyboard navigation. */}
    {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-noninteractive-element-interactions */}
    <section id="project-carousel" className="gallery-track" ref={viewport} tabIndex={0} aria-label="Galerie de construcții"
      onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault(); goTo(activeIndex.current + (event.key === 'ArrowRight' ? 1 : -1));
        } else if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault(); goTo(event.key === 'Home' ? 0 : projects.length - 1);
        }
      }}
      onScroll={() => {
        if (tween.current || drag.current) return;
        const node = viewport.current!;
        const index = projects.reduce((closest, _, i) => Math.abs(slidePosition(i) - node.scrollLeft) < Math.abs(slidePosition(closest) - node.scrollLeft) ? i : closest, 0);
        activeIndex.current = index; setActive(index);
      }}
      onWheel={interrupt} onTouchStart={interrupt}
      onPointerDown={event => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        interrupt(); suppressClick.current = false;
        drag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft, moved: false };
      }}
      onPointerMove={event => {
        const start = drag.current;
        if (!start) return;
        const delta = event.clientX - start.x;
        if (Math.abs(delta) > 5) {
          start.moved = true; suppressClick.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.style.scrollSnapType = 'none';
          event.currentTarget.scrollLeft = start.scroll - delta;
        }
      }}
      onPointerUp={event => {
        const start = drag.current;
        drag.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        if (start?.moved) goTo(Math.round(event.currentTarget.scrollLeft / slidePosition(1)));
      }}
      onPointerCancel={() => { drag.current = null; interrupt(); }}
      onDragStart={event => event.preventDefault()}
      onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}>
      {projects.map((project, i) => <figure className="gallery-frame" key={project.id} aria-roledescription="slide" aria-label={`${i + 1} din ${projects.length}: ${project.label}`}>
        <Image className="gallery-photo" src={`/images/${project.image}.webp`} alt={project.alt} fill sizes="(max-width: 700px) 88vw, (max-width: 1536px) 78vw, 1200px" draggable={false} />
        <figcaption><a href={project.url} target="_blank" rel="noreferrer" tabIndex={active === i ? 0 : -1}>{project.title}<ArrowUpRight aria-hidden="true" /></a></figcaption>
      </figure>)}
    </section>
    <div className="gallery-bottom section-shell">
      <p className="image-note">Imagini ilustrative generate cu AI</p>
      <div className="gallery-pagination"><span className="gallery-count" aria-live="polite">0{active + 1} <span>/ 03</span></span>
        <ArrowControls label="Galerie" previous={() => goTo(activeIndex.current - 1)} next={() => goTo(activeIndex.current + 1)} atStart={active === 0} atEnd={active === projects.length - 1} />
      </div>
    </div>
  </section>;
}

function Process() {
  const [step, setStep] = useState(1);
  const panel = useRef<HTMLDivElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  usePanelMotion(panel, step);
  useLayoutEffect(() => { gsap.set(marker.current, { xPercent: 100 }); }, []);
  useLayoutEffect(() => {
    const motion = gsap.to(marker.current, {
      xPercent: step * 100,
      duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : .2,
      ease: 'power3.out', overwrite: true,
    });
    // Killing retains the current position, so a rapid next click continues from there.
    return () => { motion.kill(); };
  }, [step]);

  return <section className="process-section" id="proces" aria-labelledby="process-heading">
    <div className="section-shell process-grid">
      <Tabs value={step} onValueChange={value => setStep(Number(value))} className="process-content">
        <h2 id="process-heading">De la prima discuție,<br />la predare.</h2>
        <div className="process-navigation">
          <TabsList className="process-steps" variant="line" aria-label="Etapele colaborării">
            {steps.map((item, i) => <TabsTrigger value={i} key={item.label}><span>{item.label}</span><span className="process-point" aria-hidden="true" /></TabsTrigger>)}
          </TabsList>
          <span className="process-marker" ref={marker} aria-hidden="true"><span /></span>
        </div>
        <div className="process-panels">{steps.map((item, i) => <TabsContent keepMounted value={i} key={item.label} className="process-panel">
          <div ref={step === i ? panel : undefined}>
            <h3 data-copy>{item.title}</h3>
            <p data-copy>{item.text}</p>
          </div>
        </TabsContent>)}</div>
        <p className="process-disclosure">Proces propus · Adaptat fiecărui proiect</p>
      </Tabs>
      <figure className="process-picture">
        <Image src="/images/site-visit.webp" alt="Imagine ilustrativă: doi specialiști analizează un plan pe șantier" fill sizes="(max-width: 700px) 92vw, 44vw" />
      <figcaption className="sr-only">Imagine generată cu AI</figcaption></figure>
    </div>
  </section>;
}

function DetailExplorer() {
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  usePanelMotion(panel, active);

  return <section className="detail-section" aria-labelledby="detail-heading">
    <div className="detail-picture">
      <Image src="/images/connection.webp" alt="Imagine ilustrativă: prindere cu șuruburi între o grindă de oțel și un stâlp de beton" fill sizes="(max-width: 700px) 100vw, 63vw" />
      {details.map((detail, i) => <button type="button" key={detail.title} className="detail-hotspot" style={{ left: `${detail.x}%`, top: `${detail.y}%` }} aria-label={`Detaliul ${i + 1}: ${detail.title}`} aria-pressed={active === i} aria-controls="detail-description" onClick={() => setActive(i)}>{String(i + 1).padStart(2, '0')}</button>)}
    </div>
    <div className="detail-content">
      <h2 id="detail-heading">Calitatea se vede<br />de aproape.</h2>
      <div className="detail-descriptions" id="detail-description" aria-live="polite" aria-atomic="true">
        {details.map((detail, i) => <div className="detail-description" key={detail.title} aria-hidden={active !== i} inert={active !== i} ref={active === i ? panel : undefined}>
          <span className="detail-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <h3>{detail.title}</h3>
          <p>{detail.text}</p>
        </div>)}
      </div>
      <ArrowControls label="Detaliu" previous={() => setActive((active + 2) % 3)} next={() => setActive((active + 1) % 3)} />
    </div>
  </section>;
}

const projectTypes = ['Civil', 'Industrial', 'Reabilitare'];
const projectStages = ['Am un teren', 'Am un proiect', 'Renovez'];

function ProjectEnquiry() {
  const [projectType, setProjectType] = useState('Industrial');
  const [stage, setStage] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const stageOptions = useRef<HTMLFieldSetElement>(null);
  const mailto = `mailto:office@tomorogaconstruct.ro?subject=${encodeURIComponent(`Proiect ${projectType.toLowerCase()} — solicitare de discuție`)}&body=${encodeURIComponent(`Bună ziua,\n\nAș dori să discutăm despre un proiect.\n\nTipul proiectului: ${projectType}\nEtapa: ${stage ?? 'De stabilit'}\nLocalitate: \nCâteva detalii: \nTelefon: \n\nMulțumesc!`)}`;
  function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stage) {
      setError(true);
      stageOptions.current?.querySelector<HTMLElement>('[role="radio"]')?.focus();
      return;
    }
    setPrepared(true);
    window.location.href = mailto;
  }

  return <footer className="enquiry-section" id="contact">
    <div className="section-shell enquiry-grid">
      <div className="enquiry-intro">
        <h2>Ce construim<br />împreună?</h2>
        <a href="#continut" className="brand footer-brand" aria-label="Tomoroga Construct — înapoi sus"><Image src="/tomoroga-logo.png" alt="Tomoroga Construct — Antrepriză generală" width={179} height={179} /></a>
      </div>
      <form className="project-enquiry" onSubmit={submit} noValidate>
        <fieldset><legend>Ce tip de proiect ai?</legend>
          <RadioGroup className="enquiry-options" value={projectType} onValueChange={value => { setProjectType(String(value)); setPrepared(false); }} aria-label="Tipul proiectului">
            {projectTypes.map(value => <label className="enquiry-option" key={value}><RadioGroupItem className="choice-radio" value={value} /><span>{value}</span></label>)}
          </RadioGroup>
        </fieldset>
        <fieldset ref={stageOptions}><legend>În ce etapă ești?</legend>
          <RadioGroup className="enquiry-options" value={stage} onValueChange={value => { setStage(String(value)); setError(false); setPrepared(false); }} aria-label="Etapa proiectului" aria-describedby={error ? 'stage-error' : undefined} aria-invalid={error}>
            {projectStages.map(value => <label className="enquiry-option" key={value}><RadioGroupItem className="choice-radio" value={value} /><span>{value}</span></label>)}
          </RadioGroup>
          {error && <p className="enquiry-error" id="stage-error" role="alert">Alege etapa proiectului pentru a pregăti mesajul.</p>}
        </fieldset>
        <Button type="submit" className="enquiry-submit">Să discutăm proiectul<ArrowUpRight aria-hidden="true" /></Button>
        <p className="enquiry-helper" aria-live="polite">{prepared ? <><Check size={14} aria-hidden="true" /> Mesaj pregătit. Îl poți trimite din aplicația de email.</> : 'Se deschide un email cu opțiunile tale. Tu îl trimiți.'}</p>
        <a className="enquiry-email" href={mailto}>office@tomorogaconstruct.ro</a>
      </form>
    </div>
    <div className="section-shell company-footnote" id="compania">
      <p>Tomoroga Construct · Antrepriză generală din 2004.<br /><span>Construcții civile, industriale, reabilitări și infrastructură.</span></p>
      <div><a href="tel:+40740225554">0740 225 554</a><span>Luni – Vineri, 9:00 – 17:00</span></div>
      <a href="https://www.facebook.com/tomorogaconstruct2004/" target="_blank" rel="noreferrer">Pe șantier, zi de zi <ArrowUpRight size={16} aria-hidden="true" /></a>
    </div>
    <div className="section-shell page-bottom"><span>© {new Date().getFullYear()} Tomoroga Construct</span><a href="#continut">Înapoi sus ↑</a></div>
  </footer>;
}

export default function HomeSections() {
  return <div className="home-sections"><ProjectGallery /><Process /><DetailExplorer /><ProjectEnquiry /></div>;
}
